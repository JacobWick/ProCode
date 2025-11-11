using Application.DTOs;
using Application.Interfaces;
using Application.Mappers;
using Domain.Entities;
using MediatR;

namespace Application.Tags
{
    public class CreateTagCommandHandler : IRequestHandler<CreateTagCommand, TagDto>
    {
        private readonly IRepository<Tag> _tagRepo;

        public CreateTagCommandHandler(IRepository<Tag> tagRepo)
        {
             _tagRepo = tagRepo;
        }
        public async Task<TagDto> Handle(CreateTagCommand request, CancellationToken cancellationToken)
        {
            var sameTags = await _tagRepo.GetAsync(t => t.Name == request.Name);

            if (sameTags.Any())
                return TagMapper.MapToDto(sameTags.First());

            var tag = new Tag
            {
                Name = request.Name
            };

            try
            {
                await _tagRepo.CreateAsync(tag, cancellation: cancellationToken);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while creating the tag.", ex);
            }

            return TagMapper.MapToDto(tag);

        }
    }
}
