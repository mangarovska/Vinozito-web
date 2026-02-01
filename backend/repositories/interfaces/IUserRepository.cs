using backend.models;

namespace backend.interfaces
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<User> GetByIdAsync(string id);
        Task AddAsync(User entity);
        Task UpdateAsync(User entity);
        Task DeleteAsync(string id);
        Task<User> GetByUsernameAsync(string username);
        Task<User?> GetByEmailAsync(string email); // neew
        
        // Task<User?> GetByFacebookIdAsync(string facebookId); // new
        //Task<IEnumerable<CustomCard>> GetCustomCardsAsync(string id);
    }
}