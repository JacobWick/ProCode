namespace Application.Users.Queries
{
    public class IsUserEnrolledInCourseResponse
    {
        public bool IsEnrolled { get; set; }

        public IsUserEnrolledInCourseResponse(bool isEnrolled)
        {
            IsEnrolled = isEnrolled;
        }
    }
}
