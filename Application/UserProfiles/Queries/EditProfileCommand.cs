using MediatR;

namespace Application.UserProfiles.Queries
{
    public class EditProfileCommand : IRequest<bool>
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Bio { get; set; }
        public Uri? WebsiteLink { get; set; }
        public Uri? GithubLink { get; set; }
        public Uri? LinkedinLink { get; set; }
    }
}
