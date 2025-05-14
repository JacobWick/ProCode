using Application.Interfaces;
using Application.Lessons.Commands;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Lessons.CommandHandlers
{
    public class CompleteLessonCommandHandler : IRequestHandler<CompleteLessonCommand, bool>
    {
        private readonly IRepository<Progress> _progressRepo;
        private readonly IUserContextService _userContextService;

        public CompleteLessonCommandHandler(IRepository<Progress> progressRepo, IRepository<Lesson> lessonRepo, IUserContextService userContextService, UserManager<User> userManager)
        {
            _progressRepo = progressRepo;
            _userContextService = userContextService;
        }

        public async Task<bool> Handle(CompleteLessonCommand request, CancellationToken cancellationToken)
        {
            var userId = _userContextService.UserId;

            var progressExists = await _progressRepo.GetAsync(
                p => p.User.Id == userId && p.Lesson.Id == request.LessonId,
                cancellationToken
            );

            if (progressExists != null)
            {
                return false;
            }

            var progress = new Progress()
            {
                UserId = userId,
                LessonId = request.LessonId,
                CompletedAt = DateOnly.FromDateTime(DateTime.Now),
            };

            await _progressRepo.CreateAsync(progress, cancellationToken);

            return true;
        }
    }
}
