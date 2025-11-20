using Application.DTOs; 
using MediatR;

namespace Application.Exercises.Queries
{
    public class GetAllExercisesQuery: IRequest<List<ExerciseDto>>
    {
    }
}
