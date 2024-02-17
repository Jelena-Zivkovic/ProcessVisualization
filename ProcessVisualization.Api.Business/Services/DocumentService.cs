using ProcessVisualization.Api.Business.Services.Interfaces;
using ProcessVisualization.Api.Contracts.DataTransferObjects;
using ProcessVisualization.Api.Contracts.DataTransferObjects.Documents;
using ProcessVisualization.Api.Contracts.DataTransferObjects.Elements;
using ProcessVisualization.Api.Contracts.DataTransferObjects.Shape;
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

        public ResponseTemplateDto<DocumentDetailDto> GetDocument(int id)
        {
            var doc = _documentRepository.Get(id);
            if(doc == null)
            {
                return new ResponseTemplateDto<DocumentDetailDto>(false, new DocumentDetailDto());
            }

            return new ResponseTemplateDto<DocumentDetailDto>(true, new DocumentDetailDto
            {
                Id = id,
                Name = doc.Name,
                CreatedAt = doc.CreatedAt,
                UpdatedAt = doc.LastUpdatedAt,
                RoomId = doc.RoomId,
                Connections = doc.Connections.Select(x => new ConnectionDto
                {
                    Id = x.ConnectionId,
                    Source = x.Source,
                    Target = x.Target,
                    Type = x.Type,
                    WayPoints = x.WayPoints.Select(y => new PointDto { X = y.X, Y = y.Y }).ToList(),
                }).ToList(),
                Shapes = doc.Shapes.Select(x => new ShapeDto
                {
                    Height = x.Height,
                    Width = x.Width,
                    X = x.X,
                    Y = x.Y,
                    Type = x.Type,
                    Id = x.ElementId
                }).ToList(),
            });
        }

        public ResponseTemplateDto<DocumentCreateDto?> SaveDocument(DocumentCreateDto documentDto, string UserId)
        {
            var document = new Document
            {
                Name = documentDto.Name,
                Description = documentDto.Name,
                LastUpdatedAt = DateTime.Now,
                LastUpdatedBy = UserId,
                Connections = documentDto.Connections.Select(x => new Connection
                {
                    Target = x.Target,
                    Source = x.Source,
                    Type = x.Type,
                    ConnectionId = x.Id,
                    WayPoints = x.WayPoints.Select(y => new Point
                    {
                        X = y.X,
                        Y = y.Y
                    }).ToList(),
                }).ToList(),
                Shapes = documentDto.Shapes.Select(x => new Shape
                {
                    ElementId = x.Id,
                    Height = x.Height,
                    Width = x.Width,
                    X = x.X,
                    Y = x.Y,
                    Type = x.Type,

                }).ToList(),
                RoomId = documentDto.RoomId
            };

            if (documentDto.Id.HasValue)
            {
                document.Id = documentDto.Id.Value;
                foreach (var connection in document.Connections)
                {
                    connection.DocumentId = documentDto.Id.Value;
                }

                foreach (var shape in document.Shapes)
                {
                    shape.DocumentId = documentDto.Id.Value;
                }

            }

            var res = _documentRepository.Update(document);

            return new ResponseTemplateDto<DocumentCreateDto?>(true, new DocumentCreateDto
            {
                Id = res.Result.Id,
                Name = res.Result.Name,
                RoomId = res.Result.RoomId,
                Connections = res.Result.Connections.Select(x => new ConnectionDto
                {
                    Id = x.ConnectionId,
                    Source = x.Source,
                    Target = x.Target,
                    Type = x.Type,
                    WayPoints = x.WayPoints.Select(y => new PointDto { X = y.X, Y = y.Y }).ToList(),
                }).ToList(),
                Shapes = res.Result.Shapes.Select(x => new ShapeDto
                {
                    Height = x.Height,
                    Width = x.Width,
                    X = x.X,
                    Y = x.Y,
                    Type = x.Type,
                    Id = x.ElementId
                }).ToList(),
            });
        }

        public ResponseTemplateDto<DocumentCreateDto?> CreateDocument(int roomId) {

            var document = new Document
            {
                RoomId = roomId,
                Name = "New diagram",
                Description = "Description",
                Connections = new List<Connection>(),
                Shapes = new List<Shape>(),
                CreatedAt = DateTime.Now,
                LastUpdatedAt = DateTime.Now,
                LastUpdatedBy = string.Empty,
            };
            var res = _documentRepository.Add(document);

            return new ResponseTemplateDto<DocumentCreateDto?>(true, new DocumentCreateDto
            {
                Id = res.Result.Id,
                Name = res.Result.Name,
                RoomId = res.Result.RoomId,                
                Connections = new List<ConnectionDto>(),
                Shapes = new List<ShapeDto>()
            });
        }
    }
}
