using Application.DTOs;
using MediatR;

namespace Application.Exercises.Queries
{
    public class GetRuntimesQuery : IRequest<List<PistonRuntimeResponse>>
    {
    }
}
