using ProcessVisualization.Api.Data.Models;

namespace ProcessVisualization.Api.Data.Repository
{
    public class ShapeRepository : EfCoreRepository<Shape, int>
    {
        public ShapeRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
