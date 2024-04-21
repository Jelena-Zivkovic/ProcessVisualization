using Microsoft.Extensions.Caching.Memory;
using ProcessVisualization.Api.Business.Services.Interfaces;
using ProcessVisualization.Api.Contracts.DataTransferObjects;
using ProcessVisualization.Api.Contracts.DataTransferObjects.Documents;
using ProcessVisualization.Api.Contracts.DataTransferObjects.Elements;
using ProcessVisualization.Api.Contracts.DataTransferObjects.Shape;
using ProcessVisualization.Api.Data.Models;
using ProcessVisualization.Api.Data.Repository;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace ProcessVisualization.Api.Business.Services
{
    public class DocumentService : IDocumentService
    {
        internal readonly DocumentRepository _documentRepository;
        internal readonly ShapeRepository _shapeRepository;
        internal readonly ConnectionRepository _connectionRepository;
        internal readonly MemoryCache _cache;

        public DocumentService(DocumentRepository documentRepository, ShapeRepository shapeRepository, ConnectionRepository connectionRepository) {
            _documentRepository = documentRepository;
            _shapeRepository = shapeRepository;
            _connectionRepository = connectionRepository;
            _cache = new MemoryCache(new MemoryCacheOptions());
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
                Description = doc.Description,
                CreatedAt = doc.CreatedAt,
                UpdatedAt = doc.LastUpdatedAt,
                RoomId = doc.RoomId,
                Connections = doc.Connections.Select(x => new ConnectionDto
                {
                    Id = x.Id,
                    ElementId = x.ConnectionId,
                    Source = x.Source,
                    Target = x.Target,
                    Type = x.Type,
                    //WayPoints = x.WayPoints.Select(y => new PointDto { X = y.X, Y = y.Y }).ToList(),
                }).ToList(),
                Shapes = doc.Shapes.Select(x => new ShapeDto
                {
                    Id = x.Id,
                    Height = x.Height,
                    Width = x.Width,
                    X = x.X,
                    Y = x.Y,
                    Type = x.Type,
                    ElementId = x.ElementId
                }).ToList(),
            });
        }

        public ResponseTemplateDto<DocumentCreateDto?> SaveDocument(DocumentCreateDto documentDto, string UserId)
        {
            /*var document = new Document
            {
                Name = documentDto.Name,
                Description = documentDto.Description ?? "",
                LastUpdatedAt = DateTime.Now,
                LastUpdatedBy = UserId,
                RoomId = documentDto.RoomId
            };
            Document? res;
            if ( documentDto.Id != null )
            {
                document.Id = (int)documentDto.Id;
                res = _documentRepository.Update(document).Result;
            }
            else
            {
                res = _documentRepository.Add(document).Result;
            }
            document.Connections = new Collection<Data.Models.Connection>();
            foreach (var conn in  documentDto.Connections)
            {
                var newConn = new Data.Models.Connection
                {
                    Target = conn.Target,
                    Source = conn.Source,
                    Type = conn.Type,
                    ConnectionId = conn.Id,
                };



                newConn.WayPoints = new List<Point>();

                foreach (var point in conn.WayPoints) {
                    var newPoint = new Point
                    {
                        X = point.X,
                        Y = point.Y
                    };


                    //newConn.WayPoints.Add(newPoint);
                }
            }

            document.Shapes = new Collection<Shape>();
            foreach (var shape in documentDto.Shapes)
            {
                var newShape = new Data.Models.Shape
                {
                    DocumentId = documentDto.Id ?? res.Id,
                    ElementId = shape.ElementId,
                    Height = shape.Height,
                    Width = shape.Width,
                    X = shape.X,
                    Y = shape.Y,
                    Type = shape.Type,
                };
                if (shape.Id.HasValue) {
                    newShape.Id = shape.Id.Value;
                }
                //document.Shapes.Add(newShape);                
                //_shapeRepository.Update(newShape);
            }*/

            /*if (documentDto.Id.HasValue)
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

            }*/

            /*if(res != null)
            {
                return new ResponseTemplateDto<DocumentCreateDto?>(true, new DocumentCreateDto()
                {
                    Id = res.Id,
                    Name = res.Name,
                    Description = res.Description,
                    RoomId = res.RoomId,
                    Connections = res.Connections.Select(x => new ConnectionDto
                    {
                        Id = x.ConnectionId,
                        Source = x.Source,
                        Target = x.Target,
                        Type = x.Type,
                        //WayPoints = x.WayPoints.Select(y => new PointDto { X = y.X, Y = y.Y }).ToList(),
                    }).ToList(),
                    Shapes = res.Shapes.Select(x => new ShapeDto
                    {
                        Height = x.Height,
                        Width = x.Width,
                        X = x.X,
                        Y = x.Y,
                        Type = x.Type,
                        Id = x.ElementId
                    }).ToList(),
                });

            }*/
            return new ResponseTemplateDto<DocumentCreateDto?>(false, string.Empty);

        }

        public ResponseTemplateDto<DocumentCreateDto?> CreateDocument(int roomId) {

            var document = new Document
            {
                RoomId = roomId,
                Name = "New diagram",
                Description = "Description",
                Connections = new List<Data.Models.Connection>(),
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
