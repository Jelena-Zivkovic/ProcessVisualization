﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Contracts.DataTransferObjects.User
{
    public class RegisterDto
    {
        public string Email { get; set; }
        public string Password { get; set; }

    }
}
