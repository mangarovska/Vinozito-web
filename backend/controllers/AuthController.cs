﻿using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using backend.dto;
using backend.models;
using backend.services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Google.Apis.Auth;
using System.Text.Json;
using System.Linq;
using Microsoft.Extensions.Caching.Memory;

namespace backend.controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    // TODO: brute force protection
    // to prevent brute forcing
    private const int MAX_ATTEMPTS = 5;
    private const int LOCKOUT_DURATION_MINUTES = 15;


    private readonly IUserService _userService;
    private readonly IMemoryCache _memoryCache; // to store failed login attempts temporarily
    private readonly string _jwtSecret;
    private readonly string _jwtIssuer;
    private readonly string _jwtAudience;

    public AuthController(IUserService userService, IConfiguration configuration, IMemoryCache memoryCache)
    {
        _userService = userService;
        _memoryCache = memoryCache;
        _jwtSecret = configuration["JwtSettings:Secret"]!;
        _jwtIssuer = configuration["JwtSettings:Issuer"]!;
        _jwtAudience = configuration["JwtSettings:Audience"]!;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto userLogin)
    {
        var user = await _userService.AuthenticateAsync(userLogin.Username, userLogin.Password);
        if (user == null)
        {
            return Unauthorized(new { message = "Invalid credentials" });
        }

        var token = GenerateJwtToken(user);
        return Ok(new { token, userId = user.Id, username = user.UserName });
    }

    [HttpPost("google-login")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto dto)
    {
        if (string.IsNullOrEmpty(dto.AccessToken))
            return BadRequest(new { message = "Missing access token" });

        using var httpClient = new HttpClient();
        httpClient.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", dto.AccessToken);

        var response = await httpClient.GetAsync("https://www.googleapis.com/oauth2/v3/userinfo");
        if (!response.IsSuccessStatusCode)
            return BadRequest(new { message = "Invalid Google access token" });

        var content = await response.Content.ReadAsStringAsync();
        GoogleUserInfo? userInfo;
        try
        {
            userInfo = JsonSerializer.Deserialize<GoogleUserInfo>(
                content,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
        catch (JsonException)
        {
            return BadRequest(new { message = "Invalid JSON from Google user info" });
        }

        if (userInfo == null || string.IsNullOrEmpty(userInfo.Email))
            return BadRequest(new { message = "User info from Google is incomplete" });

        var email = userInfo.Email;
        var name = string.IsNullOrEmpty(userInfo.Name) ? email : userInfo.Name;
        var profilePic = userInfo.Picture;

        var user = await _userService.GetUserByEmailAsync(email);

        if (user == null)
        {
            user = await _userService.RegisterUserAsync(
                username: email,
                password: null, // google users don't have passwords
                email: email,
                isGoogleUser: true
            );
        }

        var token = GenerateJwtToken(user);

        return Ok(new
        {
            token,
            userId = user.Id,
            username = user.UserName,
            profilePic = profilePic
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegisterDto userRegister)
    {
        // validate password strength 
        var (isValid, errorMessage) = ValidatePassword(userRegister.Password);
        if (!isValid)
        {
            return BadRequest(new { message = errorMessage });
        }

        var existingUser = await _userService.GetUserByUsernameAsync(userRegister.Username);
        if (existingUser != null)
        {
            return BadRequest(new { message = "Username is already taken" });
        }

        try
        {
            var user = await _userService.RegisterUserAsync(
                userRegister.Username,
                userRegister.Password,  // UserService will handle password hashing    
                                        //HashPassword(userRegister.Password),
                userRegister.Email
            );

            return Ok(new { message = "User registered successfully", userId = user.Id });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine(ex);
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "An unexpected error occurred." });
        }
    }

    private (bool IsValid, string ErrorMessage) ValidatePassword(string password)
    {
        if (string.IsNullOrEmpty(password))
            return (false, "Password is required");

        if (password.Length < 8)
            return (false, "Password must be at least 8 characters long");

        if (!password.Any(char.IsDigit))
            return (false, "Password must contain at least one number");

        if (!password.Any(char.IsUpper))
            return (false, "Password must contain at least one uppercase letter");

        if (!password.Any(char.IsLower))
            return (false, "Password must contain at least one lowercase letter");

        // if (!password.Any(ch => !char.IsLetterOrDigit(ch)))
        //     return (false, "Password must contain at least one special character");

        return (true, string.Empty);
    }


    [HttpPost("logout")]
    public IActionResult Logout()
    {
        return Ok("User logged out. Remove token from client."); // to inform the client to remove the token
    }

    private string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSecret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id!), // for .NET compatibility -> not a JWT standard
            new Claim(JwtRegisteredClaimNames.Sub, user.Id!), // JWT-standard "sub" claim
            new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName!), // JWT-standard "unique_name" claim
            new Claim(ClaimTypes.Name, user.UserName!), // for .NET compatibility
            new Claim(JwtRegisteredClaimNames.Email, user.Email!),
            new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64), // issued at
            //new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // JTI (JWT ID) —> unique token identifier (helpful for refresh token validation)
        };

        var token = new JwtSecurityToken(
            issuer: _jwtIssuer,
            audience: _jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    /*  SHA512 problems: --> will use Use BCrypt instead
        1. Too fast - Can be brute-forced easily
        2. No salt - Vulnerable to rainbow table attacks
        3. Same password = same hash - Reveals duplicate
    */

    public static string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public static bool VerifyPassword(string password, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(password, hash);
    }

    // private string HashPassword(string password)
    // {
    //     using var sha512 = SHA512.Create();
    //     var hashedBytes = sha512.ComputeHash(Encoding.UTF8.GetBytes(password));
    //     return Convert.ToBase64String(hashedBytes); // hashed bytes to a base64 string
    // }

    // private bool VerifyPassword(string password, string storedHash)
    // {
    //     using var sha512 = SHA512.Create();
    //     var hashedBytes = sha512.ComputeHash(Encoding.UTF8.GetBytes(password));
    //     var hashedPassword = Convert.ToBase64String(hashedBytes);
    //     return hashedPassword == storedHash;
    // }
}
