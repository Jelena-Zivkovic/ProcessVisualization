using Microsoft.EntityFrameworkCore;
using ProcessVisualization.Api.Data.Models;
using System.Security.Cryptography.X509Certificates;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace ProcessVisualization.Api.Data.Repository
{
    public class DocumentRepository : EfCoreRepository<Document, int>
    {
        private ShapeRepository _shapeRepository;
        public DocumentRepository(ApplicationDbContext context,
            ShapeRepository shapeRepository) : base(context)
        {
            _shapeRepository = shapeRepository;
        }

        public async Task<List<Document>> GetDocumentByRoomIdAsync(int roomId)
        {
            var allDocuments = await context.Set<Document>().ToListAsync();
            return allDocuments.Where(x => x.RoomId == roomId).ToList();
        }

        public Document? Get(int id)
        {
            return context.Set<Document>().Where(x => x.Id == id)
                .Include(x => x.Connections)
                .Include(x => x.Shapes).FirstOrDefault();
        }

        public async Task<Document> SaveDocument(Document document)
        {
            var existingDocument = context.Documents
                        .Where(p => p.Id == document.Id)
                        .Include(p => p.Connections)
                        .Include(x => x.Shapes)
                            .ThenInclude(x => x.InputParameters)

                        .Include(x => x.Shapes)
                            .ThenInclude(x => x.OutputParameters)
                        .SingleOrDefault();

            if (existingDocument != null)
            {
                // Update existing document
                context.Entry(existingDocument).CurrentValues.SetValues(document);
            }
            else
            {
                // Add new document
                await context.Documents.AddAsync(document);
            }

            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                    var elemetIds = document.Shapes.Select(x => x.ElementId).ToList();
                    var removedShapes = context.Shapes.Where(x => x.DocumentId == document.Id && !elemetIds.Contains(x.ElementId));

                    foreach (var shape in removedShapes)
                    {
                        context.Shapes.Remove(shape);
                    }

                    await context.SaveChangesAsync();
                    transaction.Commit();
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    throw;
                }
            }

            // Update shapes
            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                    foreach (var shape in document.Shapes)
                    {
                        var existingShape = context.Shapes.FirstOrDefault(s => s.ElementId == shape.ElementId && s.DocumentId == document.Id);

                        if (existingShape != null)
                        {
                            shape.Id = existingShape.Id;
                            // Update existing shape
                            context.Entry(existingShape).CurrentValues.SetValues(shape);
                        }
                        else
                        {
                            // Add new shape
                            await context.Shapes.AddAsync(shape);
                        }


                    }

                    await context.SaveChangesAsync();
                    foreach (var shape in document.Shapes)
                    {

                        var existingShape = context.Shapes.FirstOrDefault(s => s.ElementId == shape.ElementId && s.DocumentId == document.Id);
                        shape.Id = existingShape.Id;
                        this._shapeRepository.SaveParameters(shape);
                    }
                    transaction.Commit();
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    throw;
                }
            }

            // Update connections
            //using (var transaction = context.Database.BeginTransaction())
            //{
            //    try
            //    {
            //        var elemetIds = document.Connections.Select(x => x.ConnectionId).ToList();
            //        var removedConnections = context.Connections.Where(x => x.DocumentId == document.Id && !elemetIds.Contains(x.ConnectionId));

            //        foreach (var connection in removedConnections)
            //        {
            //            context.Connections.Remove(connection);
            //        }

            //            await context.SaveChangesAsync();
            //                            transaction.Commit();
            //    }
            //    catch (Exception)
            //    {
            //        transaction.Rollback();
            //        throw;
            //    }
            //}

            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                    foreach (var shape in document.Connections)
                    {
                        var existingConnection = context.Connections.FirstOrDefault(s => s.ConnectionId == shape.ConnectionId && s.DocumentId == document.Id);
                        
                        if (existingConnection != null)
                        {
                            shape.Id = existingConnection.Id;
                            // Update existing shape
                            context.Entry(existingConnection).CurrentValues.SetValues(shape);
                        }
                        else
                        {
                            // Add new shape
                            await context.Connections.AddAsync(shape);
                        }
                    }

                    await context.SaveChangesAsync();
                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw;
                }
            }

            await context.SaveChangesAsync();

            return document;
        }


        /*
                public Document? UpdateDocument(Document model)
                {
                    var existingDocument = context.Documents
                        .Where(p => p.Id == model.Id)
                        //.Include(p => p.Connections)
                        //.Include(x => x.Shapes)
                        .SingleOrDefault();

                    if (existingDocument != null)
                    {
                        // Update parent
                        context.Entry(existingDocument).CurrentValues.SetValues(model);

                        // Delete children
                         foreach (var existingChild in existingDocument.Shapes.ToList())
                          {
                              if (!model.Shapes.Any(c => c.Id == existingChild.Id))
                                  context.Shapes.Remove(existingChild);
                          }

                          // Update and Insert children
                          foreach (var childModel in model.Shapes)
                          {
                              var existingChild = existingDocument.Shapes
                                  .Where(c => c.Id == childModel.Id && c.Id != default(int))
                                  .SingleOrDefault();

                              if (existingChild != null)
                                  // Update child
                                  context.Entry(existingChild).CurrentValues.SetValues(childModel);
                              else
                              {
                                  // Insert child
                                  var newChild = new Shape
                                  {
                                      Height = childModel.Height,
                                      Width = childModel.Width,
                                      X = childModel.X,
                                      Y = childModel.Y,
                                      Type = childModel.Type,
                                      ElementId = childModel.ElementId
                                  };
                                  existingDocument.Shapes.Add(newChild);
                              }
                          }

                         foreach (var existingChild in existingDocument.Connections.ToList())
                         {
                             if (!model.Connections.Any(c => c.Id == existingChild.Id))
                                 context.Connections.Remove(existingChild);
                         }

                         // Update and Insert children
                         foreach (var childModel in model.Connections)
                         {
                             var existingChild = existingDocument.Connections
                                 .Where(c => c.Id == childModel.Id && c.Id != default(int))
                                 .SingleOrDefault();

                             if (existingChild != null)
                                 // Update child
                                 context.Entry(existingChild).CurrentValues.SetValues(childModel);
                             else
                             {
                                 // Insert child
                                 var newChild = new Data.Models.Connection
                                 {
                                     DocumentId = childModel.DocumentId,
                                     ConnectionId = childModel.ConnectionId,
                                     Source = childModel.Source,
                                     Target = childModel.Target,
                                     Id = childModel.Id,
                                     //Document = childModel.Document,
                                     //WayPoints = childModel.WayPoints,
                                 };
                                 existingDocument.Connections.Add(newChild);
                             }
                         }

                        context.SaveChanges();
                    }

                    return context.Documents.Where(p => p.Id == model.Id).FirstOrDefault();
                }
        */
        /*public Document? Update(Document doc)
        {
            context.Entry(doc).State = EntityState.Modified;

           // context.Entry(doc.Room).State = EntityState.Modified;
           foreach(var conn in doc.Connections)
            {
                context.Entry(conn).State = EntityState.Modified;
            }

            foreach (var shape in doc.Shapes)
            {
                context.Entry(shape).State = EntityState.Modified;
            }
            context.Update(doc);
            var con = context.SaveChangesAsync().Result;
            return doc;
        }*/
    }
}
