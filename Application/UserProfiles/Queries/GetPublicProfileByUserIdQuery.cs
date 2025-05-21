using MediatR;

namespace Application.UserProfiles.Queries
{
    public class GetPublicProfileByUserIdQuery: IRequest<PublicProfileResponse>
    {
        public Guid Id { get; set; }
    }
}
