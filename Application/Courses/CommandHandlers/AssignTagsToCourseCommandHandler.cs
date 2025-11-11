using Application.Courses.Commands;
using Application.Interfaces;
using Domain.Entities;
using MediatR;

namespace Application.Courses.CommandHandlers
{
    public class AssignTagsToCourseCommandHandler : IRequestHandler<AssignTagsToCourseCommand, bool>
    {
        private readonly IRepository<Course> _courseRepo;
        private readonly IRepository<Tag> _tagRepo;

        public AssignTagsToCourseCommandHandler(IRepository<Course> courseRepo, IRepository<Tag> tagRepo)
        {
            _courseRepo = courseRepo;
            _tagRepo = tagRepo;
        }

        public async Task<bool> Handle(AssignTagsToCourseCommand request, CancellationToken cancellationToken)
        {
            var course = await _courseRepo.GetByIdAsync(
                request.CourseId,
                includes: [c => c.Tags],
                cancellationToken: cancellationToken);

            if (course == null)
                throw new KeyNotFoundException($"Course with ID {request.CourseId} not found.");

            foreach (var tagId in request.TagIds)
            {
                var tag = await _tagRepo.GetByIdAsync(tagId, cancellationToken: cancellationToken);
                if (tag == null)
                    throw new KeyNotFoundException($"Tag with ID {tagId} not found.");

                if (!course.Tags.Any(t => t.Id == tag.Id))
                {
                    course.Tags.Add(tag);
                }            
            }

            await _courseRepo.UpdateAsync(course);

            return true;
        }
    }
}
