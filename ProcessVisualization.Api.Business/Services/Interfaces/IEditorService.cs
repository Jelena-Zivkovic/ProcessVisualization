using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using ProcessVisualization.Api.Contracts.DataTransferObjects.Diagram;
using ProcessVisualization.Api.Contracts.DataTransferObjects.Documents;
using ProcessVisualization.Api.Contracts.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Business.Services.Interfaces
{
    public interface IEditorService
    {
        public DocumentCreateDto SaveDocumnetInCache(DocumentCreateDto documnet, string roomName);
        public List<UserControleStateDto> GetUserControleStates(string roomName, string email, ControleEditorStateEnum newState);
    }
}
