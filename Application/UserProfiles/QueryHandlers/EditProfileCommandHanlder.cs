using Application.Interfaces;
using Application.UserProfiles.Queries;
using Domain.Entities;
using MediatR;

namespace Application.UserProfiles.QueryHandlers
{
    public class EditProfileCommandHandler : IRequestHandler<EditProfileCommand, bool>
    {
        private readonly IRepository<UserProfile> _profileRepository;
        private readonly IUserContextService _userContext;

        public EditProfileCommandHandler(IRepository<UserProfile> profileRepository, IUserContextService userContext)
        {
            _profileRepository = profileRepository;
            _userContext = userContext;
        }

        public async Task<bool> Handle(EditProfileCommand request, CancellationToken cancellationToken)
        {
            var userId = _userContext.UserId;

            if (userId == Guid.Empty)
            {
                throw new Exception("You have to be logged in");
            }

            var profiles= await _profileRepository.GetAsync(p => p.UserId == userId,
                includes: p => p.User,
                cancellationToken: cancellationToken);

            var profile = profiles.FirstOrDefault();

            if (profile is null)
                return false;

            profile.User.FirstName = request.FirstName ?? profile.User.FirstName;
            profile.User.LastName = request.LastName ?? profile.User.LastName;
            profile.Bio = request.Bio ?? profile.Bio;
            profile.Website = request.WebsiteLink ?? profile.Website;
            profile.GitHubLink = request.GithubLink ?? profile.GitHubLink;
            profile.LinkedinLink = request.LinkedinLink ?? profile.LinkedinLink;

            await _profileRepository.UpdateAsync(profile);

            return true;
        }
    }
}
