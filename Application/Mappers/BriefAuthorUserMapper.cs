using Application.DTOs;
using Domain.Entities;

namespace Application.Mappers;

public static class BriefAuthorUserMapper
{
    public static BriefAuthorUserDto MapToDto(User user)
    {
        return new BriefAuthorUserDto
        {
            AvatarUri = user.AvatarUri,
            FirstName = user.FirstName,
            LastName = user.LastName,
        };
    }
}