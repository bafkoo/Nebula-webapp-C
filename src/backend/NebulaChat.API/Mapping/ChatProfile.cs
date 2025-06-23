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
                .ForMember(dest => dest.CreatorUsername, opt => opt.MapFrom(src => src.Creator.Username));
            
            // Маппинг для Message -> MessageDto нужен, чтобы правильно смапить LastMessage
            CreateMap<Message, MessageDto>()
                .ForMember(dest => dest.AuthorUsername, opt => opt.MapFrom(src => src.Author.Username));
        }
    }
} 