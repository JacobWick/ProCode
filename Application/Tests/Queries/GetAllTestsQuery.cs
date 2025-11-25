using Application.DTOs;
using MediatR;

namespace Application.Tests.Queries;

public class GetAllTestsQuery: IRequest<List<TestDto>>
{
    
}