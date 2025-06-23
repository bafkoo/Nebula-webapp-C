using FluentValidation;
using NebulaChat.API.DTOs.Chat;

namespace NebulaChat.API.Validators
{
    public class CreateChatInviteRequestValidator : AbstractValidator<CreateChatInviteRequest>
    {
        public CreateChatInviteRequestValidator()
        {
            RuleFor(x => x.InviteeId)
                .NotEmpty().WithMessage("InviteeId is required.");

            RuleFor(x => x.ExpiresAt)
                .GreaterThan(DateTime.UtcNow).WithMessage("ExpiresAt must be in the future.")
                .When(x => x.ExpiresAt.HasValue);
        }
    }
} 