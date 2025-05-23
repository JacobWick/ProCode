using MediatR;

namespace Application.UserProfiles.Commands
{
    public class EditPrivacyCommand: IRequest<bool>
    {
        public bool IsProfilePublic { get; set; }
    }
}
