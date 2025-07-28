using backend.interfaces;
using backend.models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.services.impl
{
    public class CustomCardService(ICustomCardRepository customCardRepository, IUserService userService)
        : ICustomCardService
    {
        public async Task<IEnumerable<CustomCard>> GetAllAsync()
        {
            return await customCardRepository.GetAllAsync();
        }

        public async Task<CustomCard> GetByIdAsync(string id)
        {
            return await customCardRepository.GetByIdAsync(id);
        }

        public async Task AddAsync(CustomCard entity, string userId) // UPDATED
        {
            try
            {
                Console.WriteLine($"Adding custom card: {entity.Id} for user: {userId}");
                Console.WriteLine($"Card details - Title: {entity.Title}, DefaultCardId: {entity.DefaultCardId}");

                // check if a custom card already exists for this default card and user
                var existingCards = await GetAllByUserId(userId);
                var existingCard = existingCards.FirstOrDefault(c => c.DefaultCardId == entity.DefaultCardId);

                if (existingCard != null)
                {
                    Console.WriteLine($"Custom card already exists for DefaultCardId: {entity.DefaultCardId}. Updating instead of creating.");
                    // update the existing card instead
                    existingCard.Title = entity.Title;
                    existingCard.VoiceAudio = entity.VoiceAudio;
                    await UpdateAsync(existingCard);
                    return;
                }

                // save custom card first
                await customCardRepository.AddAsync(entity);
                Console.WriteLine("Custom card saved to repository");

                // then add it to the user's list
                await userService.AddCustomCardToListAsync(userId, entity.Id);
                Console.WriteLine("Custom card ID added to user's list");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in AddAsync: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                throw;
            }
        }

        public async Task UpdateAsync(CustomCard entity)
        {
            await customCardRepository.UpdateAsync(entity);
        }

        public async Task DeleteAsync(string id)
        {
            CustomCard card = await customCardRepository.GetByIdAsync(id);
            await customCardRepository.DeleteAsync(id);
            await userService.RemoveCustomCardFromListAsync(card.UserId, id);
        }

        public async Task<IEnumerable<CustomCard>> GetAllByUserId(string userId) // UPDATED
        {
            var user = await userService.GetUserByIdAsync(userId);

            if (user.CustomCardsIds == null || !user.CustomCardsIds.Any())
            {
                return Enumerable.Empty<CustomCard>();
            }

            var validCustomCards = new List<CustomCard>();
            var invalidCardIds = new List<string>();

            foreach (var cardId in user.CustomCardsIds)
            {
                try
                {
                    var customCard = await customCardRepository.GetByIdAsync(cardId);
                    validCustomCards.Add(customCard);
                }
                catch (KeyNotFoundException)
                {
                    // card was deleted but ID still in user list
                    Console.WriteLine($"CustomCard {cardId} not found but still in user's list");
                    invalidCardIds.Add(cardId);
                }
            }

            if (invalidCardIds.Any()) // clean up invalid card IDs from user's list
            {
                Console.WriteLine($"Cleaning up {invalidCardIds.Count} invalid card IDs from user's list");
                foreach (var invalidId in invalidCardIds)
                {
                    await userService.RemoveCustomCardFromListAsync(userId, invalidId);
                }
            }

            return validCustomCards;
        }

        // to find existing custom card by default card ID
        public async Task<CustomCard?> GetByDefaultCardIdAndUserIdAsync(string defaultCardId, string userId)
        {
            var userCustomCards = await GetAllByUserId(userId);
            return userCustomCards.FirstOrDefault(c => c.DefaultCardId == defaultCardId);
        }
    }
}