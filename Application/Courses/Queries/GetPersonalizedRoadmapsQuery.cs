using Application.DTOs;
using MediatR;

namespace Application.Courses.Queries
{
    public class GetPersonalizedRoadmapsQuery : IRequest<RoadmapDto>
    {
        public Guid UserId { get; set; }
    }
}
