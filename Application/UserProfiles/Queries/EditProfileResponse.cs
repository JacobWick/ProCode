namespace Application.UserProfiles.Queries
{
    public class EditProfileResponse
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Uri AvatarUrl { get; set; }
        public string Bio { get; set; }
        public Uri Website { get; set; }
        public Uri GitHubLink { get; set; }
        public Uri? LinkedinLink { get; set; }
    }
}
