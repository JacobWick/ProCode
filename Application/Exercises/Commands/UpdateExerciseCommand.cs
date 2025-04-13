using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;

namespace Application.Exercises.Commands
{
    public class UpdateExerciseCommand:IRequest<bool>
    {
        public Guid Id { get; set; }
        public string? Description { get; set; }
        public string? InitialContent { get; set; }
    }
}
