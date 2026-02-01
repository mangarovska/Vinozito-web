using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace backend.controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly string _fastApiBaseUrl;
    private readonly string _fastApiPassword;

    public UploadController(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _fastApiBaseUrl = configuration["FastAPI:InternalBaseUrl"]!;
        _fastApiPassword = configuration["FastAPI:Password"]!;
    }

    [HttpPost("image")]
    public async Task<IActionResult> UploadImage(IFormFile file, [FromQuery] string userId, [FromQuery] string? type = null)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "No file provided" });
        }

        try
        {
            // validate file type -> only allow image files
            if (!file.ContentType.StartsWith("image/"))
            {
                return BadRequest(new { message = "Invalid file type. Only images are allowed." });
            }

            Console.WriteLine($"Uploading image: {file.FileName} for user: {userId}, type: {type}");

            // prepare data to send to FastAPI
            var formData = new MultipartFormDataContent();
            var fileContent = new StreamContent(file.OpenReadStream());
            fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(file.ContentType);

            // Determine filename based on type
            string fileName;
            if (type == "profile" || type == "profilePicture")
            {
                // For profile pictures, use standard name "pp" with original extension
                var extension = Path.GetExtension(file.FileName).ToLower();
                if (string.IsNullOrEmpty(extension))
                {
                    extension = file.ContentType switch
                    {
                        "image/jpeg" => ".jpg",
                        "image/png" => ".png",
                        "image/gif" => ".gif",
                        "image/webp" => ".webp",
                        _ => ".jpg"
                    };
                }
                fileName = $"pp{extension}";
            }
            else
            {
                // For other images, use original filename with timestamp to avoid conflicts
                var extension = Path.GetExtension(file.FileName);
                var nameWithoutExt = Path.GetFileNameWithoutExtension(file.FileName);
                fileName = $"{nameWithoutExt}_{DateTime.UtcNow:yyyyMMdd_HHmmss}{extension}";
            }

            formData.Add(fileContent, "files", fileName);

            // Create user-specific folder structure: users/{userId}
            var folder = $"users/{userId}";
            var uploadUrl = $"{_fastApiBaseUrl}/upload/image?folder={Uri.EscapeDataString(folder)}&password={Uri.EscapeDataString(_fastApiPassword)}";

            Console.WriteLine($"Forwarding to FastAPI: {uploadUrl}");
            Console.WriteLine($"Using filename: {fileName}");

            // send the request(image) to FastAPI
            var response = await _httpClient.PostAsync(uploadUrl, formData);
            var responseContent = await response.Content.ReadAsStringAsync();

            Console.WriteLine($"FastAPI response status: {response.StatusCode}");
            Console.WriteLine($"FastAPI response content: {responseContent}");

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, new { message = $"Upload failed: {responseContent}" });
            }

            if (string.IsNullOrWhiteSpace(responseContent) || !responseContent.TrimStart().StartsWith("["))
            {
                return StatusCode(500, new { message = $"Unexpected response from FastAPI: {responseContent}" });
            }

            var uploadResponses = JsonSerializer.Deserialize<List<FastApiUploadResponse>>(responseContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (uploadResponses != null && uploadResponses.Count > 0)
            {
                var uploadResponse = uploadResponses[0];
                
                // Use PublicBaseUrl for the returned URL
                var publicBaseUrl = _configuration["FastAPI:PublicBaseUrl"]!;
                var fullUrl = $"{publicBaseUrl}{uploadResponse.preview_url}";

                Console.WriteLine($"Constructed full URL: {fullUrl}");

                return Ok(new
                {
                    url = fullUrl,
                    message = "Image uploaded successfully",
                    fileName = fileName,
                    type = type ?? "general"
                });
            }

            return BadRequest(new { message = "No upload response received" });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Upload error: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            return StatusCode(500, new { message = $"Upload error: {ex.Message}" });
        }
    }

    // Convenience endpoints for specific use cases
    [HttpPost("profile-picture")]
    public async Task<IActionResult> UploadProfilePicture(IFormFile file, [FromQuery] string userId)
    {
        return await UploadImage(file, userId, "profile");
    }

    [HttpPost("custom-image")]
    public async Task<IActionResult> UploadCustomImage(IFormFile file, [FromQuery] string userId)
    {
        return await UploadImage(file, userId, "custom");
    }

    [HttpPost("custom-audio")]
    public async Task<IActionResult> UploadCustomAudio(IFormFile file, [FromQuery] string userId)
    {
        return await UploadAudio(file, userId, "custom");
    }

    [HttpPost("audio")]
    public async Task<IActionResult> UploadAudio(IFormFile file, [FromQuery] string userId, [FromQuery] string? type = null)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "No file provided" });
        }

        try
        {
            if (!file.ContentType.StartsWith("audio/"))
            {
                return BadRequest(new { message = "Invalid file type. Only audio files are allowed." });
            }

            Console.WriteLine($"Uploading audio: {file.FileName} for user: {userId}, type: {type}");

            var formData = new MultipartFormDataContent();
            var fileContent = new StreamContent(file.OpenReadStream());
            fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(file.ContentType);

            // For audio files, also organize by type
            string fileName;
            if (type == "voice" || type == "voiceNote")
            {
                var extension = Path.GetExtension(file.FileName).ToLower();
                if (string.IsNullOrEmpty(extension))
                {
                    extension = ".mp3"; // Default for audio
                }
                fileName = $"voice_{DateTime.UtcNow:yyyyMMdd_HHmmss}{extension}";
            }
            else
            {
                // Use original filename with timestamp
                var extension = Path.GetExtension(file.FileName);
                var nameWithoutExt = Path.GetFileNameWithoutExtension(file.FileName);
                fileName = $"{nameWithoutExt}_{DateTime.UtcNow:yyyyMMdd_HHmmss}{extension}";
            }

            formData.Add(fileContent, "files", fileName);

            // Create user-specific folder structure: users/{userId}
            var folder = $"users/{userId}";
            var uploadUrl = $"{_fastApiBaseUrl}/upload/audio?folder={Uri.EscapeDataString(folder)}&password={Uri.EscapeDataString(_fastApiPassword)}";

            Console.WriteLine($"Forwarding to FastAPI: {uploadUrl}");
            Console.WriteLine($"Using filename: {fileName}");

            var response = await _httpClient.PostAsync(uploadUrl, formData);
            var responseContent = await response.Content.ReadAsStringAsync();

            Console.WriteLine($"FastAPI response status: {response.StatusCode}");
            Console.WriteLine($"FastAPI response content: {responseContent}");

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, new { message = $"Upload failed: {responseContent}" });
            }

            if (string.IsNullOrWhiteSpace(responseContent) || !responseContent.TrimStart().StartsWith("["))
            {
                return StatusCode(500, new { message = $"Unexpected response from FastAPI: {responseContent}" });
            }

            var uploadResponses = JsonSerializer.Deserialize<List<FastApiUploadResponse>>(responseContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (uploadResponses != null && uploadResponses.Count > 0)
            {
                var uploadResponse = uploadResponses[0];

                // Use PublicBaseUrl for the returned URL
                var publicBaseUrl = _configuration["FastAPI:PublicBaseUrl"]!;
                var fullUrl = $"{publicBaseUrl}{uploadResponse.preview_url}";

                Console.WriteLine($"Constructed full URL: {fullUrl}");

                return Ok(new
                {
                    url = fullUrl,
                    message = "Audio uploaded successfully",
                    fileName = fileName,
                    type = type ?? "general"
                });
            }

            return BadRequest(new { message = "No upload response received" });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Upload error: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            return StatusCode(500, new { message = $"Upload error: {ex.Message}" });
        }
    }
}

public class FastApiUploadResponse
{
    public string message { get; set; } = string.Empty;
    public string preview_url { get; set; } = string.Empty;

    // Additional fields that might be in the FastAPI response
    public string? url { get; set; }
    public string? file_path { get; set; }
    public string? filename { get; set; }
    public bool success { get; set; }
}