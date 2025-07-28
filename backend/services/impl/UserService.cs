﻿using System.Security.Cryptography;
using System.Text;
using backend.interfaces;
using backend.models;
using backend.services;

public class UserService(IUserRepository userRepository)
    : IUserService
{
    public async Task<User?> AuthenticateAsync(string username, string password)
    {
        var user = await userRepository.GetByUsernameAsync(username);
        if (user == null)
        {
            user = await userRepository.GetByEmailAsync(username);
        }

        if (user == null || string.IsNullOrEmpty(user.PasswordHash))
            return null;

        // use BCrypt to verify password -> handles password verification internally
        return BCrypt.Net.BCrypt.Verify(password, user.PasswordHash) ? user : null;
    }

    public async Task<IEnumerable<User>> GetAllUsersAsync()
    {
        return await userRepository.GetAllAsync();
    }

    public async Task<User> GetUserByIdAsync(string id)
    {
        var user = await userRepository.GetByIdAsync(id);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        return user;
    }

    public async Task AddUserAsync(User user)
    {
        if (string.IsNullOrEmpty(user.UserName))
        {
            throw new ArgumentException("Username is required");
        }

        var existingUser = await userRepository.GetByUsernameAsync(user.UserName);
        if (existingUser != null)
        {
            throw new InvalidOperationException("Username already exists");
        }

        await userRepository.AddAsync(user);
    }


    public async Task UpdateUserAsync(User user)
    {
        var existingUser = await userRepository.GetByIdAsync(user.Id);
        if (existingUser == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        await userRepository.UpdateAsync(user);
    }

    public async Task DeleteUserAsync(string id)
    {
        var user = await userRepository.GetByIdAsync(id);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        await userRepository.DeleteAsync(id);
    }

    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        return await userRepository.GetByUsernameAsync(username);
    }

    public async Task<User?> GetUserByEmailAsync(string email) // Changed return type to nullable User
    {
        return await userRepository.GetByEmailAsync(email);
    }

    public async Task<User> RegisterUserAsync(string username, string password, string email)
    {
        var existingUser = await userRepository.GetByUsernameAsync(username);
        if (existingUser != null)
        {
            throw new InvalidOperationException("Username already exists");
        }

        var existingEmailUser = await GetUserByEmailAsync(email);
        if (existingEmailUser != null)
        {
            throw new InvalidOperationException("Email already exists.");
        }

        // hash password with BCrypt
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

        var user = new User
        {
            UserName = username,
            PasswordHash = passwordHash, // store BCrypt hash
            Email = email,
        };

        await userRepository.AddAsync(user);
        return user;
    }

    public async Task<User> RegisterUserAsync(string username, string? password, string email, bool isGoogleUser = false)
    {
        var existingUser = await userRepository.GetByUsernameAsync(username);
        if (existingUser != null)
        {
            throw new InvalidOperationException("Username already exists");
        }

        var existingEmailUser = await GetUserByEmailAsync(email);
        if (existingEmailUser != null)
        {
            throw new InvalidOperationException("Email already exists.");
        }

        string? passwordHash = null;

        if (!isGoogleUser)
        {
            if (string.IsNullOrEmpty(password))
                throw new ArgumentException("Password is required for non-Google users");

            passwordHash = BCrypt.Net.BCrypt.HashPassword(password);
        }

        var user = new User
        {
            UserName = username,
            PasswordHash = passwordHash,
            Email = email,
        };

        await userRepository.AddAsync(user);
        return user;
    }

    // private string HashPassword(string password)
    // {
    //     using var sha512 = new SHA512CryptoServiceProvider();
    //     byte[] passwordBytes = Encoding.UTF8.GetBytes(password);
    //     byte[] hashBytes = sha512.ComputeHash(passwordBytes);
    //     return Convert.ToBase64String(hashBytes); // Convert the hash to a Base64 string
    // }

    // private string HashPassword(string password)
    // {
    //     // using (var sha512 = new SHA512CryptoServiceProvider())
    //     using var sha512 = SHA512.Create();

    //     {
    //         var hashedBytes = sha512.ComputeHash(Encoding.UTF8.GetBytes(password));
    //         return Convert.ToBase64String(hashedBytes); // Convert the hashed bytes to a base64 string
    //     }
    // }

    // private bool VerifyPassword(string password, string storedHash)
    // {
    //     // using (var sha512 = new SHA512CryptoServiceProvider())
    //     using var sha512 = SHA512.Create();

    //     {
    //         var hashedBytes = sha512.ComputeHash(Encoding.UTF8.GetBytes(password));
    //         var hashedPassword = Convert.ToBase64String(hashedBytes);

    //         return hashedPassword == storedHash; // Compare the stored hash with the newly hashed password
    //     }
    // }

    public async Task RemoveCustomCardFromListAsync(string userId, string customCardId)
    {
        var user = await userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }
        user.CustomCardsIds?.Remove(customCardId);

        await userRepository.UpdateAsync(user);
    }

    public async Task AddCustomCardToListAsync(string userId, string customCardId)
    {
        var user = await userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        if (user.CustomCardsIds == null) // initialize list if it's null
        {
            user.CustomCardsIds = new List<string>();
        }

        // add the custom card ID if it's not already in the list
        if (!user.CustomCardsIds.Contains(customCardId))
        {
            user.CustomCardsIds.Add(customCardId);
            await userRepository.UpdateAsync(user);
        }
    }

}