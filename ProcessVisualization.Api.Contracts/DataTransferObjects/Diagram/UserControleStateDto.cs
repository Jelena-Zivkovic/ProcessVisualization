using ProcessVisualization.Api.Contracts.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Contracts.DataTransferObjects.Diagram
{
    public class UserControleStateDto
    {
        public string UserEmail { get; set; }
        public ControleEditorStateEnum State { get; set; }
    }
}
