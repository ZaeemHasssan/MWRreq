using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FFnF_Request.Services
{
    public class JWTService
    {
        public string SecretKey { get; set; }
        public string TokenDuration { get; set; }

        private readonly IConfiguration _config;
        public JWTService(IConfiguration config)
        {
            _config = config;

            this.SecretKey = config.GetSection("jwtconfig").GetSection("key").Value;
            this.TokenDuration = config.GetSection("jwtconfig").GetSection("Duration").Value;
        }

        public string GenerateToken(int userId)
        {
            var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this.SecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(2),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);

        }

    }
}
