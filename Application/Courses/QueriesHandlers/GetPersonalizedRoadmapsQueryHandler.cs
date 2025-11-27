using Application.Courses.Queries;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using MediatR;
using System.Linq.Expressions;

namespace Application.Courses.QueriesHandlers
{
    public class GetPersonalizedRoadmapsQueryHandler : IRequestHandler<GetPersonalizedRoadmapsQuery, RoadmapDto>
    {
        private readonly IRepository<Course> _courseRepo;
        private readonly IUserRepository _userRepo;
        private readonly IPersonalizationService _personalizationService;
        private readonly IUserContextService _userContext;

        public GetPersonalizedRoadmapsQueryHandler(
            IRepository<Course> courseRepo, 
            IUserRepository userRepo, 
            IPersonalizationService personalizationService,
            IUserContextService userContext)
        {
            _courseRepo = courseRepo;
            _userRepo = userRepo;
            _personalizationService = personalizationService;
            _userContext = userContext;
        }

        public async Task<RoadmapDto> Handle(GetPersonalizedRoadmapsQuery request, CancellationToken cancellationToken)
        {
            var userId = _userContext.UserId;

            if (userId == Guid.Empty)
                throw new UnauthorizedAccessException("You are not authorized to access this resource.");

            var user = await _userRepo.GetUsersByIdWithProgressAndInterestsAsync(userId, cancellationToken);

            if (user is null)
                throw new Exception("User not found");

            var allCourses = await _courseRepo.GetAsync(
                c => !c.UsersEnrolled.Any(u => u.Id == userId),
                includes: new Expression<Func<Course, object>>[]
                {
                    c => c.UsersEnrolled,
                },
                cancellationToken: cancellationToken); 

            var roadmap = _personalizationService.GenerateRoadmap(user, allCourses);

            return roadmap;
        }
    }
}
