using ProcessVisualization.Api.Data.Models;

namespace ProcessVisualization.Api.Data.Repository
{
    public class ShapeRepository : EfCoreRepository<Shape, string>
    {
        public ShapeRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
