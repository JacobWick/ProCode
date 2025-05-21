using Application.Interfaces;
using Application.UserProfiles.Commands;
using Domain.Entities;
using MediatR;

namespace Application.UserProfiles.CommandHandlers
{
    public class CreateUserProfileCommandHandler : IRequestHandler<CreateUserProfileCommand, UserProfileDto>
    {
        private readonly IRepository<UserProfile> _userProfileRepository;
        public CreateUserProfileCommandHandler(IRepository<UserProfile> userProfileRepository)
        {
            _userProfileRepository = userProfileRepository;
        }

        public async Task<UserProfileDto> Handle(CreateUserProfileCommand request, CancellationToken cancellationToken)
        {
            var userProfile = new UserProfile
            {
                AvatarUrl = request.AvatarUrl,
                Bio = request.Bio,
                LinkedinLink = request.LinkedinLink,
                GitHubLink = request.GitHubLink,
                Website = request.Website,
                UserId = request.UserId
            };

            await _userProfileRepository.CreateAsync(userProfile, cancellationToken);

            return new UserProfileDto
            {
                Id = userProfile.Id,
                AvatarUrl = request.AvatarUrl,
                Bio = request.Bio,
                LinkedinLink = request.LinkedinLink,
                GitHubLink = request.GitHubLink,
                Website = request.Website,
                UserId = request.UserId
            };
        }
    }
}
