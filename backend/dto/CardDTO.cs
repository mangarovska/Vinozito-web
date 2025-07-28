namespace backend.dto;

public class CardDto(string id, string name, string audioVoice, string image, string category, CardType cardType, int? position)
{
    public string Id { get; set; } = id;
    public string Name { get; set; } = name;
    public string AudioVoice { get; set; } = audioVoice;
    public string Image { get; set; } = image;
    public string Category { get; set; } = category;
    public int? Position { get; set; } = position; // new
    public CardType CardType { get; set; } = cardType;
}