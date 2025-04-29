using Application.Interfaces;
using Application.Lessons.Commands;
using Domain.Entities;
using MediatR;

namespace Application.Lessons.CommandHandlers
{
    public class CompleteLessonCommandHandler : IRequestHandler<CompleteLessonCommand, bool>
    {
        private readonly IRepository<Lesson> _lessonRepo;
        private readonly IRepository<Progress> _progressRepo;
        private readonly IUserContextService _userContextService;


        public CompleteLessonCommandHandler(IRepository<Lesson> lessonRepo, IRepository<Progress> progressRepo, IUserContextService userContextService)
        {
            _lessonRepo = lessonRepo;
            _progressRepo = progressRepo;
            _userContextService = userContextService;
        }

        public async Task<bool> Handle(CompleteLessonCommand request, CancellationToken cancellationToken)
        {
            var userId = _userContextService.UserId;

            var lesson = await _lessonRepo.GetByIdAsync(request.LessonId, cancellationToken: cancellationToken);
            if (lesson == null)
            {
                return false;
            }

            var progresses = await _progressRepo.GetAsync(
                p => p.User.Id == userId && p.Lessons.Any(l => l.Id == lesson.Id),
                cancellationToken
            );

            var progressExists = progresses.FirstOrDefault();

            if (progressExists != null)
            {
                return false;
            }

            var progress = _progressRepo.GetAsync(
                p => p.User.Id == userId && p.Course.Id == lesson.Course.Id,
                cancellationToken
            ).Result.FirstOrDefault();

            if (progress == null) { 
                return false;
            }

            progress.Lessons.Add(lesson);

            await _progressRepo.UpdateAsync(progress, cancellationToken);

            return true;
        }
    }
}
