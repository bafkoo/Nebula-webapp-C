using FluentValidation;
using NebulaChat.API.DTOs.Chat;
using NebulaChat.Domain.Entities.Enums;

namespace NebulaChat.API.Validators
{
    public class CreateChatRequestValidator : AbstractValidator<CreateChatRequest>
    {
        public CreateChatRequestValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Chat name is required.")
                .Length(3, 50).WithMessage("Chat name must be between 3 and 50 characters.")
                .When(x => x.Type != ChatType.Private);

            RuleFor(x => x.ParticipantIds)
                .NotEmpty().WithMessage("At least one participant is required.")
                .Must(p => p.Count() == 1).WithMessage("Private chat must have exactly one other participant.")
                .When(x => x.Type == ChatType.Private);
            
            RuleFor(x => x.ParticipantIds)
                .NotEmpty().WithMessage("At least one participant is required for a group chat.")
                .When(x => x.Type == ChatType.Group);

            RuleFor(x => x.Type)
                .IsInEnum().WithMessage("Invalid chat type.");
        }
    }
} 