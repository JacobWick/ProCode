using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Exercises.Commands;
using Domain.Entities;
using Domain.Interfaces;
using MediatR;

namespace Application.Exercises.CommandHandlers
{
    public class CreateExerciseCommandHandler : IRequestHandler<CreateExerciseCommand, ExerciseDto>
    {
        private readonly IRepository<Exercise> _exerciseRepository;

        public CreateExerciseCommandHandler(IRepository<Exercise> exerciseRepository) {
            _exerciseRepository = exerciseRepository;
        }

        async Task<ExerciseDto> IRequestHandler<CreateExerciseCommand, ExerciseDto>.Handle(CreateExerciseCommand request, CancellationToken cancellationToken)
        {
            var exercise = new Exercise
            {
                Description = request.Description,
                InitialContent = request.InitialContent,
                Lesson = new Lesson { Id = request.LessonId }
            };

            await _exerciseRepository.CreateAsync(exercise);

            return new ExerciseDto
            {
                Id = exercise.Id,
                Description = exercise.Description,
                InitialContent = exercise.InitialContent,
                LessonId = exercise.Lesson.Id
            };
        }
    }
}
