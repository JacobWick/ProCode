using MediatR;
using System.Text.Json.Serialization;

namespace Application.Challenges.Commands
{
    public class SetChallengeStatusCommand : IRequest<bool>
    {
        [JsonIgnore]
        public Guid Id { get; set; }
        public bool IsCompleted { get; set; }
    }
}
