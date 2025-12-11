using MediatR;

namespace Application.Challenges.Query
{
    public class GetChallengeStatusQuery : IRequest<GetChallengeStatusResponse>
    {
        public Guid Id { get; set; }    
    }
}
