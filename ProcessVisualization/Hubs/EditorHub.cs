using Microsoft.AspNetCore.SignalR;
using ProcessVisualization.Api.Business.Services.Interfaces;
using ProcessVisualization.Api.Contracts.DataTransferObjects.Documents;
using ProcessVisualization.Api.Contracts.Enum;
using System.Text.RegularExpressions;

namespace ProcessVisualization.Api.Host.Hubs
{
    public sealed class EditorHub : Hub
    {
        private readonly IEditorService _editorService;

        public EditorHub(IEditorService editorService)
        {
            _editorService = editorService;
        }
        public async Task SendMessageToGroup(string groupName, string user, DocumentCreateDto diagram)
        {
            await Clients.OthersInGroup(groupName).SendAsync("ReceiveMessage", user, diagram);
        }



        /* public async Task GetControl(string groupName, string user, DocumentCreateDto diagram)
         {
             await Clients.Group(groupName).SendAsync("ReceiveControl", user, diagram);
         }*/

        public async Task AddToGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }

        public async Task RemoveFromGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }

        public async Task DocumentUpdatedInGroup(string groupName, string diagram)
        {
            await Clients.Group(groupName).SendAsync("ReceiveUpdatedDiagram", diagram);
        }

        public async Task ChangeContoleEditorState(string groupName, string user, int state)
        {
            var controlStack = _editorService.GetUserControleStates(groupName, user, (ControleEditorStateEnum)state);
            await Clients.Group(groupName).SendAsync("ReceiveContoleEditorState", user, controlStack);//controlStack
        }
    }
}
