using Application.Courses.Commands;
using Application.Interfaces;
using Domain.Entities;
using MediatR;

namespace Application.Courses.CommandHandlers;

public class DeleteCourseCommandHandler : IRequestHandler<DeleteCourseCommand, bool>
{
    private readonly IRepository<Course> _courseRepository;

    public DeleteCourseCommandHandler(IRepository<Course> courseRepository)
    {
        _courseRepository = courseRepository;
    }

    public async Task<bool> Handle(DeleteCourseCommand request, CancellationToken cancellationToken)
    {
        var course = await _courseRepository.GetByIdAsync(request.Id, cancellationToken: cancellationToken);
        if (course == null)
            return false;
        await _courseRepository.DeleteAsync(course, cancellationToken);
        return true;
    }
}