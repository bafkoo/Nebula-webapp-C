using AutoMapper;
using NebulaChat.API.DTOs.Chat;
using NebulaChat.Domain.Entities;

namespace NebulaChat.API.Mapping
{
    public class ChatProfile : Profile
    {
        public ChatProfile()
        {
            CreateMap<Chat, ChatDto>()
                .ForMember(dest => dest.ParticipantCount, opt => opt.MapFrom(src => src.Participants.Count))
                .ForMember(dest => dest.CreatorUsername, opt => opt.MapFrom(src => src.Creator.Username))
                .ForMember(dest => dest.MaxParticipants, opt => opt.MapFrom(src => src.MaxParticipants));
            
            // Маппинг для Message -> MessageDto с поддержкой файлов
            CreateMap<Message, MessageDto>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.AuthorId))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Author.Username))
                .ForMember(dest => dest.AvatarUrl, opt => opt.MapFrom(src => src.Author.AvatarUrl))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type))
                .ForMember(dest => dest.FileUrl, opt => opt.MapFrom(src => src.FileUrl))
                .ForMember(dest => dest.FileName, opt => opt.MapFrom(src => src.FileName))
                .ForMember(dest => dest.FileSize, opt => opt.MapFrom(src => src.FileSize))
                .ForMember(dest => dest.MimeType, opt => opt.MapFrom(src => src.MimeType));

            CreateMap<ChatInvite, ChatInviteDto>();

            // Mapping for chat participants
            CreateMap<ChatParticipant, ParticipantDto>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.Username))
                .ForMember(dest => dest.AvatarUrl, opt => opt.MapFrom(src => src.User.AvatarUrl))
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role))
                .ForMember(dest => dest.JoinedAt, opt => opt.MapFrom(src => src.JoinedAt))
                .ForMember(dest => dest.IsBanned, opt => opt.MapFrom(src => src.IsBanned))
                .ForMember(dest => dest.BannedUntil, opt => opt.MapFrom(src => src.BannedUntil))
                .ForMember(dest => dest.BanReason, opt => opt.MapFrom(src => src.BanReason));
        }
    }
} 