using Microsoft.AspNetCore.SignalR;
using ProcessVisualization.Api.Contracts.DataTransferObjects.Documents;
using System.Text.RegularExpressions;

namespace ProcessVisualization.Api.Host.Hubs
{
    public sealed class EditorHub : Hub
    {

        public async Task SendMessageToGroup(string groupName, string user, DocumentCreateDto diagram)
        {
            await Clients.Group(groupName).SendAsync("ReceiveMessage", user, diagram);
        }

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
    }
}
