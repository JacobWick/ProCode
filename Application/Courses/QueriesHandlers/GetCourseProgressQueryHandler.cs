using Application.Courses.Queries;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using MediatR;

namespace Application.Courses.QueriesHandlers
{
    public class GetCourseProgressQueryHandler : IRequestHandler<GetCourseProgressQuery, CourseProgressDto>
    {
        private readonly IRepository<Course> _courseRepository;
        private readonly IRepository<Lesson> _lessonRepository;
        private readonly IRepository<Progress> _progressRepository;
        private readonly IUserContextService _userContext;

        public GetCourseProgressQueryHandler(IRepository<Course> courseRepository, IRepository<Lesson> lessonRepository, IRepository<Progress> progressRepository, IUserContextService userContext)
        {
            _courseRepository = courseRepository;
            _lessonRepository = lessonRepository;
            _progressRepository = progressRepository;
            _userContext = userContext;
        }

        public async Task<CourseProgressDto?> Handle(GetCourseProgressQuery request, CancellationToken cancellationToken)
        {
            var userId = _userContext.UserId;

            var courseExists = await _courseRepository.GetByIdAsync(request.CourseId, cancellationToken: cancellationToken);
            if (courseExists == null)
            {
                return null;
            }

            var completedLessons = await _progressRepository.GetAsync(p => p.UserId == userId && p.Lesson.Course.Id == request.CourseId, cancellationToken);

            var totalLessons = await _lessonRepository.GetAsync(l => l.Course.Id == request.CourseId, cancellationToken);

            return new CourseProgressDto
            {
                CourseId = request.CourseId,
                Title = courseExists.Title,
                TotalLessons = totalLessons.Count,
                CompletedLessons = completedLessons.Count,
                CompletedLessonsIds = completedLessons.Select(l => l.Id).ToList()
            };
        }
    }
}
