namespace backend.models;

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class DefaultCard
{
    [BsonId]
    [BsonRepresentation(BsonType.String)]
    public string? Id { get; set; }

    public required string Name { get; set; }
    public required string AudioVoice { get; set; }
    public required string Image { get; set; }
    public required string Category { get; set; }

    [BsonIgnoreIfNull]
    public int? Position { get; set; }
}
