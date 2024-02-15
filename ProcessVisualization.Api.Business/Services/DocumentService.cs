using ProcessVisualization.Api.Business.Services.Interfaces;
using ProcessVisualization.Api.Contracts.DataTransferObjects;
using ProcessVisualization.Api.Contracts.DataTransferObjects.Documents;
using ProcessVisualization.Api.Data.Models;
using ProcessVisualization.Api.Data.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Business.Services
{
    public class DocumentService : IDocumentService
    {
        internal readonly DocumentRepository _documentRepository;

        public DocumentService(DocumentRepository documentRepository) {
            _documentRepository = documentRepository;
        }
        public ResponseTemplateDto<DateTime?> SaveDocument(DocumentCreateDto documentDto, string UserId)
        {
            var document = new Document
            {
                Id = documentDto.Id,
                Name = documentDto.Name,
                LastUpdatedAt = new DateTime(),
                LastUpdatedBy = UserId,
                Connections = documentDto.Connections.Select(x => new Connection
                {
                    DocumentId = documentDto.Id,
                    Target = x.Target,
                    Source = x.Source,
                    Type = x.Type,
                    ConnectionId = x.ConnectionId,
                    WayPoints = x.WayPoints.Select(y => new Point
                    {
                        X = y.X,
                        Y = y.Y
                    }).ToList(),
                }).ToList(),
                Shapes = documentDto.Shapes.Select(x => new Shape
                {
                    Id = x.Id,
                    Height = x.Height,
                    Width = x.Width,
                    X = x.X,
                    Y = x.Y,
                    Type = x.Type,

                }).ToList(),
                RoomId = documentDto.RoomId
            };

            var savedDocument = _documentRepository.Get(documentDto.Id);
            Task<Document>? res = null;
            try
            {
                if (savedDocument != null)
                {
                    res = _documentRepository.Update(document);
                }
                else {
                    res = _documentRepository.Add(document);
                }

            }catch (Exception ex)
            {
                if (savedDocument != null) {
                    return new ResponseTemplateDto<DateTime?>(false,savedDocument.Result.LastUpdatedAt, "Not save last version");
                }
                return new ResponseTemplateDto<DateTime?>(false, "Not save");
            }

            return new ResponseTemplateDto<DateTime?>(true, res.Result.LastUpdatedAt);
        }
    }
}
