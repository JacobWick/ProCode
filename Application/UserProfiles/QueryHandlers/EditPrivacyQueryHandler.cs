using Application.Common.Exceptions;
using Application.Interfaces;
using Application.UserProfiles.Queries;
using Domain.Entities;
using MediatR;

namespace Application.UserProfiles.QueryHandlers
{
    public class EditPrivacyQueryHandler: IRequestHandler<EditPrivacyQuery, PrivacyResponse>
    {
        public IRepository<UserProfile> _userProfileRepository;
        public IUserContextService _userContextService;

        public EditPrivacyQueryHandler(IRepository<UserProfile> userProfileRepository, IUserContextService userContextService)
        {
            _userProfileRepository = userProfileRepository;
            _userContextService = userContextService;
        }

        public async Task<PrivacyResponse> Handle(EditPrivacyQuery request, CancellationToken cancellationToken)
        {
            var userId = _userContextService.UserId;
            
            if (userId == Guid.Empty)
            {
                throw new UserContextNotFoundException("UserId couldn't be found");
            }

            var userProfiles = await _userProfileRepository.GetAsync(up => up.UserId == userId, cancellationToken: cancellationToken);

            var userProfile = userProfiles.FirstOrDefault();

            if (userProfile == null)
            {
                throw new NotFoundException("No profile found", nameof(UserProfile));
            }

            return new PrivacyResponse
            {
                IsProfilePublic = userProfile.IsProfilePublic,
            };
        }
    }
}
