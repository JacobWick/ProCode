using Application.DTOs;
using Domain.Entities;

namespace Application.Interfaces
{
    public interface IPersonalizationService
    {
        RoadmapDto GenerateRoadmap(User user, IEnumerable<Course> courses);
    }
}
