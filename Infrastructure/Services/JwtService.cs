using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Application.Interfaces;
using Domain.Entities;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace Infrastructure.Services
{
    public class JwtService: IJwtService
    {
        private readonly IConfiguration _config;

        public JwtService(IConfiguration configuration)
        {
            _config = configuration;
        }

        public string GenerateToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.FirstName ?? ""),
                new Claim(ClaimTypes.Surname, user.LastName ?? ""),
                new Claim(ClaimTypes.Email, user.Email ?? "")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expires = DateTime.UtcNow.AddMinutes(double.Parse(_config["Jwt:ExpiresInMinutes"]!));

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
