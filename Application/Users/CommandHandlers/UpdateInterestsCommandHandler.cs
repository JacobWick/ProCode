using Application.Common.Exceptions;
using Application.Interfaces;
using Application.Users.Commands;
using Domain.Entities;
using MediatR;
using System.Security.Authentication;

namespace Application.Users.CommandHandlers
{
    public class UpdateInterestsCommandHandler : IRequestHandler<UpdateInterestsCommand, bool>
    {
        private readonly IRepository<User> _userRepo;
        private readonly IRepository<Tag> _tagRepo;
        private readonly IUserContextService _userContext;

        public UpdateInterestsCommandHandler(IRepository<User> userRepo, IUserContextService userContext, IRepository<Tag> tagRepo)
        {
            _userRepo = userRepo;
            _userContext = userContext;
            _tagRepo = tagRepo;
        }

        public async Task<bool> Handle(UpdateInterestsCommand request, CancellationToken cancellationToken)
        {
            var userId = _userContext.UserId;

            if (userId == Guid.Empty)
            {
                throw new AuthenticationException("UserId couldn't be found");
            }

            var users = await _userRepo.GetAsync(
                u => u.Id == userId, 
                includes: u => u.TagsIntrestedIn,
                cancellationToken: cancellationToken);

            var user = users.FirstOrDefault();

            if (user == null)
            {
                throw new NotFoundException("User not found", typeof(User));
            }

            var tags = await _tagRepo.GetAsync(
                t => request.Tags.Contains(t.Id),
                cancellationToken: cancellationToken);

            if (tags.Count > 20)
                return false;

            user.TagsIntrestedIn.Clear();

            user.TagsIntrestedIn = tags;

            await _userRepo.UpdateAsync(user, cancellationToken);

            return true;
        }
    }
}
