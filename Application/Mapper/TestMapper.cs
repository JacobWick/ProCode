using Application.DTOs;
using Domain.Entities;

namespace Application.Mapper;

public static class TestMapper
{
    public static TestDto MapToDto(Test test)
    {
        return new TestDto
        {
            Id = test.Id,
            ExerciseId = test.Exercise.Id,
            InputData = test.InputData.ToList(),
            OutputData = test.OutputData.ToList()
        };
    }
}