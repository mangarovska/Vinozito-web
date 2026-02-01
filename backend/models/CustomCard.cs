using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.models;

public class CustomCard // ADDED MongoDB Annotations -> to map C# properties to MongoDB fields
{
    [BsonId]
    [BsonRepresentation(BsonType.String)]
    public required string Id { get; set; }

    [BsonElement("defaultCardId")]
    public required string DefaultCardId { get; set; }

    [BsonElement("voiceAudio")]
    public required string VoiceAudio { get; set; }

    [BsonElement("title")]
    public required string Title { get; set; }

    [BsonElement("userId")]
    public required string UserId { get; set; }

    [BsonElement("image")]
    public string? Image { get; set; } // should the CustomCard image be editable?

    // [BsonElement("category")]  // NEW - for add new card feature
    // public string? Category { get; set; }
}