namespace Application.UserProfiles.Queries
{
    public class GetMyProfileResponse
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public string? LastName { get; set; }
        public string? FirstName { get; set; }
        public string? UserEmail { get; set; }
        public List<string> Roles { get; set; }
        public Uri? AvatarUrl { get; set; }
        public string? Bio { get; set; }
        public Uri? Website { get; set; }
        public Uri? GitHubLink { get; set; }
        public Uri? LinkedinLink { get; set; }
        public List<Guid> CourseIds { get; set; }
    }
}
