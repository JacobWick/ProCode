using MediatR;

namespace Application.Lessons.Commands
{
    public class CompleteLessonCommand: IRequest<bool>
    {
        public Guid LessonId { get; set; }
    }
}
