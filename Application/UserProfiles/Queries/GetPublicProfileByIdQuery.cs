using MediatR;

namespace Application.UserProfiles.Queries
{
    public class GetPublicProfileByIdQuery: IRequest<PublicProfileResponse>
    {
        public Guid Id { get; set; }
    }
}
