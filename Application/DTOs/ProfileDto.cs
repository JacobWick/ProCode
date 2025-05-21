namespace Application.DTOs
{
    public class ProfileDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Biography { get; set; }
        public Uri AvatarUri { get; set; }
        public string Email { get; set; }

        public ICollection<string> Roles { get; set; }
    }
}
