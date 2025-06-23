using FluentValidation;
using NebulaChat.API.DTOs.Chat;

namespace NebulaChat.API.Validators
{
    public class AddParticipantRequestValidator : AbstractValidator<AddParticipantRequest>
    {
        public AddParticipantRequestValidator()
        {
            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("User ID is required.");
        }
    }
} 