using Application.Common.Exceptions;
using Application.Interfaces;
using Application.UserProfiles.Queries;
using Domain.Entities;
using MediatR;

namespace Application.UserProfiles.QueryHandlers
{
    public class GetPublicProfileByIdQueryHandler : IRequestHandler<GetPublicProfileByIdQuery, PublicProfileResponse>
    {
        public IRepository<UserProfile> _userProfileRepository;
        public IRepository<Course> _courseRepository;

        public GetPublicProfileByIdQueryHandler(IRepository<UserProfile> userProfileRepository, IRepository<Course> courseRepository)
        {
            _userProfileRepository = userProfileRepository;
            _courseRepository = courseRepository;
        }
        public async Task<PublicProfileResponse> Handle(GetPublicProfileByIdQuery request, CancellationToken cancellationToken)
        {
            var userProfile = await _userProfileRepository.GetByIdAsync(request.Id, cancellationToken: cancellationToken);

            if (userProfile == null)
            {
                throw new NotFoundException("No profile found", nameof(UserProfile));
            }

            if (userProfile.IsProfilePublic == false)
            {
                throw new ForbiddenAccessException("This profile is private.");
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
