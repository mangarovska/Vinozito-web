using backend.interfaces;
using backend.models;
using backend.services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using backend.dto;

namespace backend.controllers

{
    [Authorize] // to protect all endpoints in this controller
    // must include a valid JWT or other auth token
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserById(string id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                return Ok(user);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "User not found" });
            }
        }

        [HttpGet("protected")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public IActionResult GetProtectedData()
        {
            var username = User.Identity?.Name; // retrieves the Name claim from the JWT token
            return Ok(new { message = $"Hello {username}, you accessed a protected endpoint!" }); // shows if the JWT is valid and the user is authenticated
        }

        [HttpPost]
        public async Task<ActionResult> AddUser(User user)
        {
            try
            {
                await _userService.AddUserAsync(user);
                return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateUser(string id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest(new { message = "User ID mismatch" });
            }

            try
            {
                await _userService.UpdateUserAsync(user);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "User not found" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(string id)
        {
            try
            {
                await _userService.DeleteUserAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "User not found" });
            }
        }

        [HttpGet("username/{username}")]
        public async Task<ActionResult<User>> GetUserByUsername(string username)
        {
            try
            {
                var user = await _userService.GetUserByUsernameAsync(username);
                return Ok(user);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "User not found" });
            }
        }


        [HttpGet("profile")]
        public async Task<ActionResult<object>> GetCurrentUserProfile()
        {
            try
            {
                // Get current user ID from JWT token
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                                   User.FindFirst("sub")?.Value;

                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var user = await _userService.GetUserByIdAsync(currentUserId);

                // Return only safe profile data
                var profileData = new
                {
                    id = user.Id,
                    userName = user.UserName,
                    email = user.Email,
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    profilePicture = user.ProfilePicture,
                    createdAt = user.CreatedAt,
                    isGoogleUser = user.IsGoogleUser  // NEW

                };

                return Ok(profileData);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "User not found" });
            }
            catch (Exception ex)
            {
                // Log the exception for debugging
                Console.WriteLine($"Error in GetCurrentUserProfile: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPut("profile")]
        public async Task<ActionResult> UpdateCurrentUserProfile([FromBody] ProfileUpdateDto profileDto)
        {
            try
            {
                // Get current user ID from JWT token
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                                   User.FindFirst("sub")?.Value;

                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var user = await _userService.GetUserByIdAsync(currentUserId);

                // Check if username is being changed and if it's available
                if (!string.IsNullOrEmpty(profileDto.UserName) &&
                    profileDto.UserName != user.UserName)
                {
                    var existingUser = await _userService.GetUserByUsernameAsync(profileDto.UserName);
                    if (existingUser != null)
                    {
                        return BadRequest(new { message = "Username already exists" });
                    }
                    user.UserName = profileDto.UserName;
                }

                // Check if email is being changed and if it's available
                if (!string.IsNullOrEmpty(profileDto.Email) &&
                    profileDto.Email != user.Email)
                {
                    var existingEmailUser = await _userService.GetUserByEmailAsync(profileDto.Email);
                    if (existingEmailUser != null)
                    {
                        return BadRequest(new { message = "Email already exists" });
                    }
                    user.Email = profileDto.Email;
                }

                // Update profile fields
                if (profileDto.FirstName != null)
                    user.FirstName = profileDto.FirstName;

                if (profileDto.LastName != null)
                    user.LastName = profileDto.LastName;

                // Handle profile picture - accept both URLs and base64
                if (profileDto.ProfilePicture != null)
                {
                    user.ProfilePicture = profileDto.ProfilePicture;
                }

                user.UpdatedAt = DateTime.UtcNow;

                await _userService.UpdateUserAsync(user);

                return Ok(new { message = "Profile updated successfully" });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "User not found" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
