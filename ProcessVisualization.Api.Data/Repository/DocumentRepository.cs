using Microsoft.EntityFrameworkCore;
using ProcessVisualization.Api.Data.Models;
using System.Security.Cryptography.X509Certificates;

namespace ProcessVisualization.Api.Data.Repository
{
    public class DocumentRepository : EfCoreRepository<Document, int>
    {
        public DocumentRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<List<Document>> GetDocumentByRoomIdAsync(int roomId)
        {
            var allDocuments = await context.Set<Document>().ToListAsync();
            return allDocuments.Where(x => x.RoomId == roomId).ToList();
        }
    }
}
