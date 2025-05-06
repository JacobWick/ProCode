using Application.DTOs;
using MediatR;

namespace Application.Courses.Queries;

public class GetAllCoursesQuery : IRequest<List<CourseDto>>;
