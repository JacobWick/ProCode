using MediatR;

namespace Application.Exercises.Commands
{
    public class DeleteExerciseCommand: IRequest<bool>
    {
        public Guid Id { get; set; }
    }
}
