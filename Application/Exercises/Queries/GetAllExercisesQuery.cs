using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs;
using Domain.Entities;
using MediatR;

namespace Application.Exercises.Queries
{
    public class GetAllExercisesQuery: IRequest<List<ExerciseDto>>
    {
    }
}
