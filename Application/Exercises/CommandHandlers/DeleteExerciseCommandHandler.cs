using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Exercises.Commands;
using Domain.Entities;
using Domain.Interfaces;
using MediatR;

namespace Application.Exercises.CommandHandlers
{
    public class DeleteExerciseCommandHandler : IRequestHandler<DeleteExerciseCommand, bool>
    {
        private readonly IRepository<Exercise> _exerciseRepository;

        public DeleteExerciseCommandHandler(IRepository<Exercise> exerciseRepository)
        {
            _exerciseRepository = exerciseRepository;
        }

        public async Task<bool> Handle(DeleteExerciseCommand request, CancellationToken cancellationToken)
        {
            var exercise = await _exerciseRepository.GetByIdAsync(request.Id, cancellationToken: cancellationToken);

            if (exercise == null)
                return false;

            await _exerciseRepository.DeleteAsync(exercise, cancellation: cancellationToken);
            return true;
        }
    }
}
