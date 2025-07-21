namespace backend.models;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


public class CustomCard
{
    
    public required string Id { get; set; }
    public required string DefaultCardId { get; set; }
    public required string VoiceAudio { get; set; } 
    public required string Title { get; set; } 
    public required string UserId { get; set; } 
}