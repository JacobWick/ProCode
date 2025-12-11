using Application.DTOs;
using Domain.Entities;

namespace Application.Mappers;

public static class TestMapper
{
    public static TestDto MapToDto(Test test)
    {
        return new TestDto
        {
            Id = test.Id,
            ExerciseId = test.Exercise?.Id ?? Guid.Empty,
        };
    }
    public static List<TestDto> MapListToDto(ICollection<Test> tests)
    {
        return tests.Select(MapToDto).ToList();
    }
}