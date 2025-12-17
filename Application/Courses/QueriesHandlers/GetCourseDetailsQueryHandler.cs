using Application.Courses.Queries;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using MediatR;

namespace Application.Courses.QueriesHandlers
{
    public class GetCourseDetailsQueryHandler : IRequestHandler<GetCourseDetailsQuery, CourseDetailsDto>
    {
        private readonly IRepository<Course> _courseRepository;

        public GetCourseDetailsQueryHandler(IRepository<Course> courseRepository)
        {
            _courseRepository = courseRepository;
        }

        public async Task<CourseDetailsDto> Handle(GetCourseDetailsQuery request, CancellationToken cancellationToken)
        {
            var course = await _courseRepository.GetByIdAsync(
                request.CourseId,
                includes: c => c.Lessons,
                cancellationToken: cancellationToken);

            if (course == null)
            {
                throw new Exception();
            }

            var courseDetailsDto = new CourseDetailsDto
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                CreatedOn = course.CreatedOn,
                Lessons = course.Lessons
                    .Select(l => new LessonOverview(
                        l.Id,
                        l.Title,
                        l.Description
                    ))
                    .ToList(),
                DifficultyLevel = course.DifficultyLevel
            };

            return courseDetailsDto;
        }
    }
}
