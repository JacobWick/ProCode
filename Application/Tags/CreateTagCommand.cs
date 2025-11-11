using Application.DTOs;
using MediatR;

namespace Application.Tags
{
    public class CreateTagCommand : IRequest<TagDto>
    {
        public string Name { get; set; }
    }
}
