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

        public Document? UpdateDocument(Document model)
        {
            var existingDocument = context.Documents
                .Where(p => p.Id == model.Id)
                .Include(p => p.Connections)
                .Include(x => x.Shapes)
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
