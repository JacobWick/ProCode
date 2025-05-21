using Domain.Interfaces;

namespace Domain.Entities
{
    public class UserProfile: IEntity
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }

        public Uri AvatarUrl { get; set; } = new Uri("https://www.gravatar.com/avatar/");
        public string? Bio { get; set; }
        public Uri? Website { get; set; }
        public Uri? GitHubLink { get; set; }
        public Uri? LinkedinLink { get; set; }

        public User User { get; set; } = null!;
    }
}
