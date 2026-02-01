using backend.models;
using backend.services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CustomCardController(ICustomCardService customCardService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var customCards = await customCardService.GetAllAsync();
        return Ok(customCards);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        try
        {
            var customCard = await customCardService.GetByIdAsync(id);
            return Ok(customCard);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Custom card not found" });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Add([FromBody] CreateCustomCardDto dto) // UPDATED
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            // check if a custom card already exists for this default card and user
            var existingCard = await customCardService.GetByDefaultCardIdAndUserIdAsync(dto.DefaultCardId, dto.UserId);

            if (existingCard != null) // update the existing card instead of creating a new one
            {

                existingCard.Title = dto.Title;
                existingCard.VoiceAudio = dto.VoiceAudio;
                existingCard.Image = dto.Image;

                await customCardService.UpdateAsync(existingCard);

                return Ok(new
                {
                    id = existingCard.Id,
                    title = existingCard.Title,
                    voiceAudio = existingCard.VoiceAudio,
                    image = existingCard.Image,
                    defaultCardId = existingCard.DefaultCardId,
                    userId = existingCard.UserId,
                    message = "Existing custom card updated"
                });
            }

            var customCard = new CustomCard // else if it doesn't exist create new
            {
                Id = Guid.NewGuid().ToString(),
                DefaultCardId = dto.DefaultCardId,
                VoiceAudio = dto.VoiceAudio,
                Title = dto.Title,
                UserId = dto.UserId,
                Image = dto.Image
            };

            await customCardService.AddAsync(customCard, dto.UserId);

            var result = new
            {
                id = customCard.Id,
                title = customCard.Title,
                voiceAudio = customCard.VoiceAudio,
                image = customCard.Image,
                defaultCardId = customCard.DefaultCardId,
                userId = customCard.UserId,
                message = "New custom card created"
            };

            return CreatedAtAction(nameof(GetById), new { id = customCard.Id }, result);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in CustomCard Add: {ex.Message}");
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateCustomCardDto dto) // UPDATED
    {
        try
        {
            var existingCard = await customCardService.GetByIdAsync(id);

            existingCard.Title = dto.Title ?? existingCard.Title;
            existingCard.VoiceAudio = dto.VoiceAudio ?? existingCard.VoiceAudio;
            existingCard.Image = dto.Image ?? existingCard.Image;

            await customCardService.UpdateAsync(existingCard);
            return Ok(existingCard);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Custom card not found" });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in CustomCard Update: {ex.Message}");
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        try
        {
            await customCardService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Custom card not found" });
        }
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUserId(string userId) // NEW -> fetch custom cards for a specific user
    {
        try
        {
            var cards = await customCardService.GetAllByUserId(userId);
            return Ok(cards);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in GetByUserId: {ex.Message}");
            return BadRequest(new { message = ex.Message });
        }
    }
}
// input DTOs that represent what the frontend is allowed to send when creating/updating
// so internal data structure is not exposed -> what frontend (is allowed to) sends
public class CreateCustomCardDto // all required fields when creating a card
{
    public required string DefaultCardId { get; set; }
    public required string VoiceAudio { get; set; }
    public required string Title { get; set; }
    public required string UserId { get; set; }
    public string? Image { get; set; }
}

public class UpdateCustomCardDto // optional fields when updating an existing card
{
    public string? Title { get; set; }
    public string? VoiceAudio { get; set; }
    public string? Image { get; set; }
}