﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Business.Services.Interfaces
{
    public interface IMailService
    {

        Task SendEmailAsync(string toEmail, string subject, string content);
    }
}