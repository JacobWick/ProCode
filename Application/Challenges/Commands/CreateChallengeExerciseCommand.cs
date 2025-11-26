using Domain.Entities;
using MediatR;
using System.ComponentModel;
using System.Text.Json.Serialization;

namespace Application.Challenges.Commands
{
    public class CreateChallengeExerciseCommand : IRequest<bool>
    {
        [JsonIgnore]
        public Guid ChallengeId { get; set; }
        public string Description { get; set; } = null!;
        public string InitialContent { get; set; } = null!;
    }
}
