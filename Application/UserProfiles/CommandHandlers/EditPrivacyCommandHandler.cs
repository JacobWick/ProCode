using Application.Common.Exceptions;
using Application.Interfaces;
using Application.UserProfiles.Commands;
using Domain.Entities;
using MediatR;

namespace Application.UserProfiles.CommandHandlers
{
    public class EditPrivacyCommandHandler : IRequestHandler<EditPrivacyCommand, bool>
    {
        private readonly IRepository<UserProfile> _userProfileRepository;
        private readonly IUserContextService _userContextService;

        public EditPrivacyCommandHandler(IRepository<UserProfile> userProfileRepositor, IUserContextService userContextService)
        {
            _userProfileRepository = userProfileRepositor;
            _userContextService = userContextService;
        }

        public async Task<bool> Handle(EditPrivacyCommand request, CancellationToken cancellationToken)
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

            userProfile.IsProfilePublic = request.IsProfilePublic;

            return true;
        }
    }
}
