using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Runtime.Caching;
using ProcessVisualization.Api.Business.Services.Interfaces;
using ProcessVisualization.Api.Contracts.DataTransferObjects.Diagram;
using ProcessVisualization.Api.Contracts.DataTransferObjects.Documents;
using ProcessVisualization.Api.Contracts.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace ProcessVisualization.Api.Business.Services
{
    public class EditorService : IEditorService
    {
        private MemoryCache _stateCache = null;
        private MemoryCache _editorCache = null;
        private string _stateCacheKey = "EditorContoleState";
        private string _editorCacheKey = "Editor";
        public EditorService() {
            _stateCache = new MemoryCache(_stateCacheKey);
            _editorCache = new MemoryCache(_editorCacheKey);
        }

        public List<UserControleStateDto> GetUserControleStates(string roomName, string email, ControleEditorStateEnum newState)
        {
            IDictionary<string, List<UserControleStateDto>>? roomControleStates = (IDictionary<string, List<UserControleStateDto>>?)_stateCache.GetValues(_stateCacheKey, roomName);
            List<UserControleStateDto> states = null;
            if (roomControleStates.TryGetValue(roomName, out states))
            {

                if (newState == ControleEditorStateEnum.HaveContole && states.Exists(x => x.State == ControleEditorStateEnum.HaveContole))
                {
                    newState = ControleEditorStateEnum.RequestForContole;
                }

                if (newState == ControleEditorStateEnum.NoContole)
                {
                    if (states.Exists(x => x.State == ControleEditorStateEnum.RequestForContole))
                    {
                        var stateReq = states.Where(x => x.State == ControleEditorStateEnum.RequestForContole).FirstOrDefault();
                        stateReq.State = ControleEditorStateEnum.HaveContole;
                    }
                }

                var currentUser = states.Where(x => x.UserEmail == email).FirstOrDefault();

                if (currentUser == null)
                {
                    states.Add(new UserControleStateDto { UserEmail = email, State = newState });
                }
                else
                {
                    currentUser.State = newState;
                }
            }
            return states;
        }

        public DocumentCreateDto SaveDocumnetInCache(DocumentCreateDto documnet, string roomName)
        {
            _editorCache.Add(roomName, documnet, new CacheItemPolicy());
            return documnet;
        }
    }
}
