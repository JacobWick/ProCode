using MediatR;

namespace Application.UserProfiles.Commands
{
    public class CreateUserProfileCommand: IRequest<UserProfileDto>
    {
        public Guid UserId { get; set; }

        public Uri AvatarUrl { get; set; }
        public string? Bio { get; set; }
        public Uri? Website { get; set; }
        public Uri? GitHubLink { get; set; }
        public Uri? LinkedinLink { get; set; }
    }
}
