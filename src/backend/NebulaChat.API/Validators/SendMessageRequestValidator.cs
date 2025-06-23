using FluentValidation;
using NebulaChat.API.DTOs.Chat;

namespace NebulaChat.API.Validators
{
    public class SendMessageRequestValidator : AbstractValidator<SendMessageRequest>
    {
        public SendMessageRequestValidator()
        {
            RuleFor(x => x.Content)
                .NotEmpty().WithMessage("Message content cannot be empty.")
                .MaximumLength(4000).WithMessage("Message content cannot exceed 4000 characters.");

            RuleFor(x => x.Type)
                .IsInEnum().WithMessage("Invalid message type.");
        }
    }
} 