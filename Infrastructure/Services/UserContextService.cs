using System.Security.Claims;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Services
{
    public class UserContextService: IUserContextService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserContextService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public Guid UserId =>
            Guid.Parse(_httpContextAccessor.HttpContext?.User.FindFirstValue("nameidentifier") ?? Guid.Empty.ToString());

        public bool IsAuthenticated =>
            _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated ?? false;

        public string UserName =>
            _httpContextAccessor.HttpContext?.User?.FindFirstValue("name") ?? string.Empty;

        public string Email =>
            _httpContextAccessor.HttpContext?.User?.FindFirstValue("email") ?? string.Empty;

        public List<string> Roles =>
            _httpContextAccessor.HttpContext?.User?.Claims
                .Where(c => c.Type == "role")
                .Select(c => c.Value).ToList() ?? new();
    }
}
