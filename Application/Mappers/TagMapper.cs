using Application.DTOs;
using Domain.Entities;
using System.Reflection.Metadata.Ecma335;

namespace Application.Mappers
{
    public static class TagMapper
    {
        public static TagDto MapToDto(Tag tag)
        {
            return new TagDto
            {
                Id = tag.Id,
                Name = tag.Name
            };
        }
        public static List<TagDto> MapListToDto(ICollection<Tag> tags)
        {
            return tags.Select(MapToDto).ToList();
        }
    }
}
