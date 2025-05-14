namespace Application.DTOs
{
    public class BriefAuthorUserDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public Uri? AvatarUri { get; set; }
    }
}
