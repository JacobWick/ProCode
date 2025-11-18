using Application.Common.Exceptions;
using Application.Interfaces;
using Application.UserProfiles.Queries;
using Domain.Constants;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.UserProfiles.QueryHandlers
{
    public class GetMyProfileProfileQueryHandler : IRequestHandler<EditProfileQuery, GetMyProfileResponse>
    {
        private readonly IRepository<UserProfile> _userProfileRepository;
        private readonly IRepository<UserCourse> _enrollmentRepository;
        private readonly IUserContextService _userContextService;
        private readonly UserManager<User> _userManager;

        public GetMyProfileProfileQueryHandler(
            IRepository<UserProfile> userProfileRepository, 
            IRepository<UserCourse> enrollmentRepository, 
            IUserContextService userContextService, 
            UserManager<User> userManager)
        {
            _userContextService = userContextService;
            _enrollmentRepository = enrollmentRepository;
            _userProfileRepository = userProfileRepository;
            _userManager = userManager;
        }

        public async Task<GetMyProfileResponse> Handle(EditProfileQuery request, CancellationToken cancellationToken)
        {
            var userId = _userContextService.UserId;

            if ( userId == Guid.Empty)
            {
                throw new UserContextNotFoundException("UserId couldn't be found");
            }

            
            var userProfiles = await _userProfileRepository.GetAsync(up => up.UserId == userId, cancellationToken: cancellationToken);
        
            var userProfile = userProfiles.FirstOrDefault();

            if (userProfile == null)
            {
                throw new NotFoundException("No profile found", nameof(UserProfile));
            }

            var enrollments = await _enrollmentRepository.GetAsync(e => e.UserId == userId, cancellationToken);

            var courseIds = enrollments.Select(e => e.CourseId).ToList();

            var user = await _userManager.FindByIdAsync(userId.ToString());

            if (user == null)
            {
                throw new NotFoundException("No user found", nameof(User));
            }

            var roles = await _userManager.GetRolesAsync(user);

            if (roles == null)
            {
                roles = [];
            }

            return new GetMyProfileResponse
            {
                Id = userProfile.Id,
                FirstName = user.FirstName ?? "",
                LastName = user.LastName ?? "",
                UserName = user.UserName ?? "",
                Roles = roles.ToList(),
                AvatarUrl = userProfile.AvatarUrl,
                Bio = userProfile.Bio ?? "",
                LinkedinLink = userProfile.LinkedinLink,
                GitHubLink = userProfile.GitHubLink,
                Website = userProfile.Website,
                UserId = userProfile.UserId,
                CourseIds = courseIds
            };
        }
    }
}
