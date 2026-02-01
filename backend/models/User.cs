using Microsoft.AspNetCore.Identity;

namespace backend.models;

public class User : IdentityUser
{
    // IdentityUser already provides:
    // - Id, UserName, Email, PasswordHash, etc.
    
    // Additional profile fields
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? ProfilePicture { get; set; } // Base64 encoded image or URL
    
    // Social login identifiers
    //public string? FacebookId { get; set; } // Add this for Facebook users
    public string? GoogleId { get; set; } // You might want to add this for Google users too
    public bool IsGoogleUser { get; set; } = false; // Track if user is Google user

    // Password reset functionality
    // public string? PasswordResetToken { get; set; }
    // public DateTime? PasswordResetTokenExpiry { get; set; }


    // Existing properties
    public Settings? Settings { get; set; }
    public List<string>? CustomCardsIds { get; set; } = [];
    
    // Metadata
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}

