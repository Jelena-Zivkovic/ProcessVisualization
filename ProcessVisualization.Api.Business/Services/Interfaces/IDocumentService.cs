using ProcessVisualization.Api.Contracts.DataTransferObjects;
using ProcessVisualization.Api.Contracts.DataTransferObjects.Documents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Business.Services.Interfaces
{
    public interface IDocumentService
    {
        public ResponseTemplateDto<DocumentCreateDto?> SaveDocument(DocumentCreateDto document, string UserId);
        public ResponseTemplateDto<DocumentDetailDto> GetDocument(int id);
        public ResponseTemplateDto<DocumentCreateDto?> CreateDocument(int roomId);
    }
}