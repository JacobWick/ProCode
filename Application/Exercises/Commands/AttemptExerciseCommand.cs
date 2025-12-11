using Application.Exercises.CommandHandlers;
using MediatR;
using System.Text.Json.Serialization;

namespace Application.Exercises.Commands
{
    public class AttemptExerciseCommand : IRequest<AttemptExerciseResponse>
    {
        [JsonIgnore]
        public Guid ExerciseId { get; set; }
        public string CodeSubmission { get; set; }
    }
}
