using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NebulaChat.API.DTOs;
using NebulaChat.Infrastructure.Data;

namespace NebulaChat.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly NebulaChatDbContext _context;
        public UsersController(NebulaChatDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Поиск пользователей по имени или email
        /// </summary>
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<UserDto>>> SearchUsers([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Query cannot be empty");

            var users = await _context.Users
                .Where(u => u.Username.Contains(query) || u.Email.Contains(query))
                .ToListAsync();

            var dtos = users.Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                IsEmailVerified = u.IsEmailVerified,
                CreatedAt = u.CreatedAt
            }).ToList();

            return Ok(dtos);
        }
    }
} 