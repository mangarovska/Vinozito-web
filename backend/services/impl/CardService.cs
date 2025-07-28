using backend.dto;
using backend.models;

namespace backend.services.impl;

public class CardService(
    ICustomCardService customCardService,
    IDefaultCardService defaultCardService) : ICardService
{
    public async Task<IEnumerable<CardDto>> GetCardsByUserId(string userId)
    {

        var defaultCards = await defaultCardService.GetAllDefaultCardsAsync(); // get all default cards
        var customCards = await customCardService.GetAllByUserId(userId); // get all custom cards

        // create a dictionary of custom cards by DefaultCardId for quick lookup
        var customCardDict = customCards
            .Where(cc => cc != null && !string.IsNullOrEmpty(cc.DefaultCardId))
            .ToDictionary(cc => cc.DefaultCardId);

        // build the merged card list
        var cards = defaultCards
            .Where(dc => dc != null && !string.IsNullOrEmpty(dc.Id))
            .Select(dc =>
            {

                if (customCardDict.TryGetValue(dc.Id!, out var customCard)) // check if there's a custom version of this default card
                {
                    return new CardDto( // return custom version -> this REPLACES the default card
                        id: dc.Id!, // keep the default card ID as the main identifier
                        name: customCard.Title, // custom title
                        audioVoice: customCard.VoiceAudio, // custom audio
                        image: customCard.Image ?? dc.Image, // custom image if available, otherwise default
                        category: dc.Category, // keep default category
                        cardType: CardType.Custom,
                        position: dc.Position
                    );
                }

                return new CardDto( // return default version
                    id: dc.Id!,
                    name: dc.Name,
                    audioVoice: dc.AudioVoice,
                    image: dc.Image,
                    category: dc.Category,
                    cardType: CardType.Default,
                    position: dc.Position
                );
            })
            .OrderBy(card => card.Position ?? int.MaxValue) // handle null positions
            .ToList();

        return cards;
    }

    public async Task<IEnumerable<CardDto>> GetCardsByUserIdAndCategroyTask(string userId, string category)
    {
        var allCards = await GetCardsByUserId(userId);
        return allCards.Where(card =>
            !string.IsNullOrEmpty(card.Category) &&
            string.Equals(card.Category, category, StringComparison.OrdinalIgnoreCase) // case-insensitive comparison
        ).ToList();
    }
}