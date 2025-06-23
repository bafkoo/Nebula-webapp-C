using FluentValidation;
using NebulaChat.API.DTOs.Chat;

namespace NebulaChat.API.Validators
{
    public class UpdateGroupSettingsRequestValidator : AbstractValidator<UpdateGroupSettingsRequest>
    {
        public UpdateGroupSettingsRequestValidator()
        {
            RuleFor(x => x.Name)
                .MaximumLength(100).WithMessage("Name cannot exceed 100 characters.");

            RuleFor(x => x.Description)
                .MaximumLength(500).WithMessage("Description cannot exceed 500 characters.");

            RuleFor(x => x.MaxParticipants)
                .GreaterThan(0).WithMessage("MaxParticipants must be greater than zero.")
                .LessThanOrEqualTo(10000).WithMessage("MaxParticipants cannot exceed 10000.")
                .When(x => x.MaxParticipants.HasValue);
        }
    }
} 