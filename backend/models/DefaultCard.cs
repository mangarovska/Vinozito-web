namespace backend.models;

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class DefaultCard
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public required string Name { get; set; }

    public string? AudioVoice { get; set; }

    public required string Image { get; set; }

    public required string Category { get; set; }

    [BsonIgnoreIfNull]
    public int? Position { get; set; }
}


// using MongoDB.Bson;
// using MongoDB.Bson.Serialization.Attributes;

// namespace backend.models;

// public class DefaultCard
// {
//     [BsonId]
//     [BsonRepresentation(BsonType.String)]
//     public required string Id { get; set; } = Guid.NewGuid().ToString();

//     [BsonElement("name")]
//     public required string Name { get; set; }

//     [BsonElement("audioVoice")]
//     public required string AudioVoice { get; set; }

//     [BsonElement("image")]
//     public required string Image { get; set; }

//     [BsonElement("category")]
//     public required string Category { get; set; }

//     [BsonElement("position")]
//     public int? Position { get; set; }

//     [BsonElement("isActive")]
//     public bool IsActive { get; set; } = true;

//     [BsonElement("createdAt")]
//     public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
// }