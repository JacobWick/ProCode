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
