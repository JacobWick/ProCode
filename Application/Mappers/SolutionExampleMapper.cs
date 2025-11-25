using Application.DTOs;
using Domain.Entities;

namespace Application.Mappers;

public static class SolutionExampleMapper
{
    public static SolutionExampleDto MapToDto(SolutionExample solutionExample)
    {
        return new SolutionExampleDto
        {
            Id = solutionExample.Id,
            Code = solutionExample.Code,
            Explanation = solutionExample.Explanation
        };
    }

    public static List<SolutionExampleDto> MapListToDto(ICollection<SolutionExample> solutionExamples)
    {
        return solutionExamples.Select(MapToDto).ToList();
    }
}