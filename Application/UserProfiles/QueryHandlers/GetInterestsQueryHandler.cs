using Application.Interfaces;
using Application.Mappers;
using Application.UserProfiles.Queries;
using Domain.Entities;
using MediatR;
using System.Linq.Expressions;

namespace Application.UserProfiles.QueryHandlers
{
    public class GetInterestsQueryHandler : IRequestHandler<GetInterestsQuery, GetInterestsResponse>
    {
        private readonly IRepository<User> _userRepo;
        private readonly IUserContextService _userConext;

        public GetInterestsQueryHandler(IRepository<User> userRepo, IUserContextService userConext)
        {
            _userRepo = userRepo;
            _userConext = userConext;
        }

        public async Task<GetInterestsResponse> Handle(GetInterestsQuery request, CancellationToken cancellationToken)
        {
            var userId = _userConext.UserId;

            if (userId == Guid.Empty)
                throw new UnauthorizedAccessException("User is not authorized");

            var user = await _userRepo.GetByIdAsync(
                userId,
                includes: new[] { (Expression<Func<User, object>>)(u => u.TagsIntrestedIn) },
                cancellationToken: cancellationToken
            );

            var response = new GetInterestsResponse
            {
                Tags = TagMapper.MapListToDto(user.TagsIntrestedIn)
            };

            return response;
        }
    }
}
