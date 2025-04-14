using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs;
using MediatR;

namespace Application.Exercises.Commands
{
    public class CreateExerciseCommand: IRequest<ExerciseDto>
    {
        public string Description { get; set; } = string.Empty;
        public string InitialContent { get; set; } = string.Empty;
        public Guid LessonId { get; set; }
    }
}
