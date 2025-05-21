namespace Application.UserProfiles.Queries
{
    public class PublicProfileResponse
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public Uri AvatarUrl { get; set; }
        public string Bio { get; set; }
        public ICollection<string> Roles { get; set; }
        public ICollection<CourseOverviewDto> BestCourses { get; set; }
        
    }
}
