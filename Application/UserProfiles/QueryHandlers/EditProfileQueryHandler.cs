using Application.Common.Exceptions;
using Application.Interfaces;
using Application.UserProfiles.Queries;
using Domain.Entities;
using MediatR;

namespace Application.UserProfiles.QueryHandlers
{
    public class EditProfileQueryHandler : IRequestHandler<EditProfileQuery, EditProfileResponse>
    {
        private readonly IRepository<UserProfile> _userProfileRepository;
        private readonly IUserContextService _userContextService;

        public EditProfileQueryHandler(IRepository<UserProfile> userProfileRepository, IUserContextService userContextService)
        {
            _userContextService = userContextService;
            _userProfileRepository = userProfileRepository;
        }

        public async Task<EditProfileResponse> Handle(EditProfileQuery request, CancellationToken cancellationToken)
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

            return new EditProfileResponse
            {
                AvatarUrl = userProfile.AvatarUrl,
                Bio = userProfile.Bio,
                LinkedinLink = userProfile.LinkedinLink,
                GitHubLink = userProfile.GitHubLink,
                Website = userProfile.Website,
                UserId = userProfile.UserId
            };
        }
    }
}
