using Application.Interfaces;
using Application.Users.Queries;
using Domain.Entities;
using MediatR;

namespace Application.Users.QueryHandlers
{
    public class IsUserEnrolledInCourseQueryHandler : IRequestHandler<IsUserEnrolledInCourseQuery, IsUserEnrolledInCourseResponse>
    {
        private readonly IRepository<UserCourse> _enrollmentRepo;
        private readonly IUserContextService _userContext;
        public IsUserEnrolledInCourseQueryHandler(IRepository<UserCourse> enrollmentRepo, IUserContextService userContext)
        {
            _enrollmentRepo = enrollmentRepo;
            _userContext = userContext;
        }

        public async Task<IsUserEnrolledInCourseResponse> Handle(IsUserEnrolledInCourseQuery request, CancellationToken cancellationToken)
        {
            var userId = _userContext.UserId;

            if (userId == Guid.Empty)
                throw new Exception("You have to be logged in");

            var enrollment = await _enrollmentRepo.GetAsync(
                e => e.UserId == userId,
                cancellationToken: cancellationToken);

            if (!enrollment.Any())
            {
                return new IsUserEnrolledInCourseResponse(false);
            }

            return new IsUserEnrolledInCourseResponse(true);
        }
    }
}
