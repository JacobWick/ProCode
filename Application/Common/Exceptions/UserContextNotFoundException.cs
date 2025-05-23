namespace Application.Common.Exceptions
{
    public class UserContextNotFoundException: Exception
    {
        public UserContextNotFoundException(string message = "User context couldn't be found"): base()
        {
            
        }
    }
}
