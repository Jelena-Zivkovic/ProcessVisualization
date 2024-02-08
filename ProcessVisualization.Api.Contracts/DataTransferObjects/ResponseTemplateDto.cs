using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Contracts.DataTransferObjects
{
    public class ResponseTemplateDto<T>
    {
        public bool IsSuccess { get; set; }
        public T Data { get; set; }
        public string Message { get; set; }
        public ResponseTemplateDto() { 
            this.IsSuccess = true;
            this.Message = string.Empty;
        }
        public ResponseTemplateDto(bool isSuccess, T data) {  IsSuccess = isSuccess; Data = data; Message = string.Empty; }
        public ResponseTemplateDto(bool isSuccess, string msg) { IsSuccess = isSuccess; Message = msg; }
        public ResponseTemplateDto(bool isSuccess, T data, string message) : this(isSuccess, data)
        {
            Message = message;
        }
    }
}
