using Application.DTOs;
using MediatR;

namespace Application.Users.Queries
{
    public class GetMyProfileQuery: IRequest<ProfileDto>
    {

    }
}
