using backend.models;

namespace backend.services
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> GetUserByIdAsync(string id);
        Task AddUserAsync(User user);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(string id);
        Task<User?> GetUserByUsernameAsync(string username);
        Task AddCustomCardToListAsync(string userId, string customCardId);
        Task RemoveCustomCardFromListAsync(string userId, string customCardId);
        //Task<IEnumerable<CustomCard>> GetAllCustomCardsAsync(string id);
        Task<User?> AuthenticateAsync(string username, string password);
        Task<User> RegisterUserAsync(string username, string email, string password);
        Task<User> RegisterUserAsync(string username, string? password, string email, bool isGoogleUser = false, string? profilePicture = null); // new
        Task<User?> GetUserByEmailAsync(string email); // new
        // Task<User> RegisterFacebookUserAsync(string facebookId, string name, string? profilePicture = null); // new
        // Task<User?> GetUserByFacebookIdAsync(string facebookId); // new
    }
}