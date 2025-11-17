using Application.Courses.Commands;
using Application.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Courses.CommandHandlers
{
    public class EnrollInCourseCommandHandler : IRequestHandler<EnrollInCourseCommand, bool>
    {
        private readonly IRepository<Course> _courseRepo;
        private readonly UserManager<User> _userManager;
        private readonly IUserContextService _userContext;

        public EnrollInCourseCommandHandler(IRepository<Course> courseRepo, UserManager<User> userManager, IUserContextService userContext)
        {
            _courseRepo = courseRepo;
            _userContext = userContext;
            _userManager = userManager;
        }

        public async Task<bool> Handle(EnrollInCourseCommand request, CancellationToken cancellationToken)
        {
            var userId = _userContext.UserId;

            if (userId == Guid.Empty)
            {
                throw new Exception("You have to be logged in");
            }

            var user = await _userManager.FindByIdAsync(userId.ToString());

            if (user == null)
            {
                return false;
            }

            var course = await _courseRepo.GetByIdAsync(request.CourseId, cancellationToken: cancellationToken);

            if (course == null)
            {
                return false;
            }

            var enrollment = new UserCourse
            {
                UserId = userId,
                CourseId = course.Id,
            };

            course.UsersEnrolled.Add(enrollment);

            await _courseRepo.SaveChangesAsync();

            return true;
        }
    }
}
