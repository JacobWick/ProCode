using MediatR;
using System.Text.Json.Serialization;

namespace Application.Courses.Commands
{
    public class AssignTagsToCourseCommand : IRequest<bool>
    {
        [JsonIgnore]
        public Guid CourseId { get; set; }
        public List<Guid> TagIds { get; set; } = new();
    }
}
