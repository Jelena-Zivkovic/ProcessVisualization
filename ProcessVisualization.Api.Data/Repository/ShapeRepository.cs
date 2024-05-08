using ProcessVisualization.Api.Data.Models;
using System.Reflection.Metadata;
using System.Xml.Linq;

namespace ProcessVisualization.Api.Data.Repository
{
    public class ShapeRepository : EfCoreRepository<Shape, int>
    {
        public ShapeRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Shape> SaveShape(Shape shape)
        {
            var existingShape = context.Shapes.FirstOrDefault(s => s.ElementId == shape.ElementId);

            if (existingShape != null)
            {
                shape.Id = existingShape.Id;
                context.Entry(existingShape).CurrentValues.SetValues(shape);
            }
            else {
               await context.Shapes.AddAsync(shape);
            }
            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                        

                    await context.SaveChangesAsync();
                    transaction.Commit();
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    throw;
                }
            }


            await context.SaveChangesAsync();

            return shape;
        }

        public async Task<Shape> SaveParameters(Shape shape)
        {
            var existingShape = context.Shapes.FirstOrDefault(s => s.ElementId == shape.ElementId);

            if (existingShape == null)
            {
                return null;
            }
            
           //using (var transaction = context.Database.BeginTransaction())
           // {
           //     try
           //     {
           //         var removedItems = context.InputParameters.Where(x => x.ShapeId == shape.Id);

           //         foreach (var item in removedItems)
           //         {
           //             context.InputParameters.Remove(item);
           //         }

           //         await context.SaveChangesAsync();
           //         transaction.Commit();
           //     }
           //     catch (Exception)
           //     {
           //         transaction.Rollback();
           //         throw;
           //     }
           // }

            //using (var transaction = context.Database.BeginTransaction())
            //{
            //    try
            //    {
            //        var removedItems = context.OutputParameter.Where(x => x.ShapeId == shape.Id);

            //        foreach (var item in removedItems)
            //        {
            //            context.OutputParameter.Remove(item);
            //        }

            //        await context.SaveChangesAsync();
            //        transaction.Commit();
            //    }
            //    catch (Exception)
            //    {
            //        transaction.Rollback();
            //        throw;
            //    }
            //}

            //using (var transaction = context.Database.BeginTransaction())
            //{
                try
                {
                    
                    //var existingParams = .Where(s => s.ShapeId == shape.Id).ToList();

                    foreach (var item in shape.InputParameters)
                    {
                        var existingParam = context.InputParameters.FirstOrDefault(s => s.ShapeId == shape.Id && s.SerialNumber == item.SerialNumber );

                    item.ShapeId = shape.Id;
                    if (existingParam != null)
                        {
                           item.Id = existingParam.Id;
                            context.Entry(existingParam).CurrentValues.SetValues(item);
                        }
                        else
                        {
                            await context.InputParameters.AddAsync(item);
                        }
                    }

            //        await context.SaveChangesAsync();
            //        transaction.Commit();
            //    }
            //    catch (Exception ex)
            //    {
            //        transaction.Rollback();
            //        throw;
            //    }
            //}

            //using (var transaction = context.Database.BeginTransaction())
            //{
            //    try
            //    {
                    //var existingParams = shape.OutputParameters.Where(s => s.ShapeId == shape.Id).ToList();

                    foreach (var item in shape.OutputParameters)
                    {
                        var existingParam = context.OutputParameter.FirstOrDefault(s => s.ShapeId == shape.Id && s.SerialNumber == item.SerialNumber);

                    item.ShapeId = shape.Id;
                    if (existingParam != null)
                        { 
                            item.Id = existingParam.Id;
                            context.Entry(existingParam).CurrentValues.SetValues(item);
                        }
                        else
                        {
                            await context.OutputParameter.AddAsync(item);
                        }
                    }

                    //await context.SaveChangesAsync();
                    //transaction.Commit();
                }
                catch (Exception)
                {
                    //transaction.Rollback();
                    throw;
                }
            //}

            return shape;
        }
    }
}
