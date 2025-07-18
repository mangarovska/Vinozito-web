using backend.dto;
using backend.models;

namespace backend.services.impl;

public class CardService(
    ICustomCardService customCardService,
    IDefaultCardService defaultCardService) : ICardService
{
   public async Task<IEnumerable<CardDto>> GetCardsByUserId(string id)
{
    // Fetch custom and default cards, assigning empty lists if they are null
    var customCards = await customCardService.GetAllByUserId(id);
    var defaultCards = await defaultCardService.GetAllDefaultCardsAsync();
    
    // Filter out any null entries and any CustomCard with a null DefaultCardId
    var customCardDict = customCards
        .Where(cc => true)  // Check for non-null entries and valid DefaultCardId
        .ToDictionary(cc => cc.DefaultCardId);

    var cards = defaultCards
    .Where(dc => dc.Id != null)  // <-- Filter out null Ids here
    .Select(dc =>
    {
        if (customCardDict.TryGetValue(dc.Id!, out var customCard)) // `dc.Id!` since filtered non-null
        {
            return new CardDto(
                id: dc.Id!,  // null-forgiving operator since filtered
                name: customCard.Title ?? dc.Name,
                audioVoice: customCard.VoiceAudio ?? dc.AudioVoice,
                image: dc.Image,
                category: dc.Category,
                cardType: CardType.Custom,
                position: dc.Position

            );
        }

        return new CardDto(
            id: dc.Id!,  // null-forgiving operator here too
            name: dc.Name,
            audioVoice: dc.AudioVoice,
            image: dc.Image,
            category: dc.Category,
            cardType: CardType.Default,
            position: dc.Position

        );
    })
    .ToList();


    return cards;
}


    public async Task<IEnumerable<CardDto>> GetCardsByUserIdAndCategroyTask(string id, string category)
    {
        var cards = await GetCardsByUserId(id);
        var cardsCategory = new List<CardDto>();
        foreach (var card in cards)
        {
            if (card.Category == category)
            {
                cardsCategory.Add(card);
            }
        }
        return cardsCategory.ToList();
        
    }
    
}