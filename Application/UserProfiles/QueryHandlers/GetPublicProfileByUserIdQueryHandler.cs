using Application.Interfaces;
using Application.UserProfiles.Queries;
using Domain.Entities;
using MediatR;

namespace Application.UserProfiles.QueryHandlers
{
    public class GetPublicProfileByUserIdQueryHandler : IRequestHandler<GetPublicProfileByUserIdQuery, PublicProfileResponse?>
    {
        public IRepository<UserProfile> _userProfileRepository;
        public IRepository<Course> _courseRepository;

        public GetPublicProfileByUserIdQueryHandler(IRepository<UserProfile> userProfileRepository, IRepository<Course> courseRepository)
        {
            _userProfileRepository = userProfileRepository;
            _courseRepository = courseRepository;
        }
        public async Task<PublicProfileResponse?> Handle(GetPublicProfileByUserIdQuery request, CancellationToken cancellationToken)
        {
            var userProfiles = await _userProfileRepository.GetAsync(up => up.UserId == request.Id);

            var userProfile = userProfiles.FirstOrDefault();

            if (userProfile == null)
            {
                return null;
            }

            return new PublicProfileResponse
            {
                Id = userProfile.Id,
                FirstName = userProfile.User.FirstName,
                LastName = userProfile.User.LastName,
                AvatarUrl = userProfile.AvatarUrl,
                Bio = userProfile.Bio,
                BestCourses = userProfile.User.Courses.OrderBy(c => c.Rating).Take(5).Select(c => new CourseOverviewDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Description = c.Description,
                    Rating = c.Rating,
                }).ToList(),
            };
        }
    }
}
