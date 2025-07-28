using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace backend.controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly HttpClient _httpClient; // to forward requests to the FastAPI on server
    private readonly IConfiguration _configuration; // not in use

    public UploadController(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    [HttpPost("image")] // endpoint to upload images
    public async Task<IActionResult> UploadImage(IFormFile file, [FromQuery] string userId)
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

            Console.WriteLine($"Uploading image: {file.FileName} for user: {userId}");

            // prepare data to send to FastAPI
            var formData = new MultipartFormDataContent();
            var fileContent = new StreamContent(file.OpenReadStream());
            fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(file.ContentType);
            formData.Add(fileContent, "files", file.FileName);

            // create folder path for the user
            var folder = $"custom/{userId}";
            var uploadUrl = $"http://mangaserver.ddnsfree.com:5001/upload/image?folder={Uri.EscapeDataString(folder)}";

            Console.WriteLine($"Forwarding to FastAPI: {uploadUrl}");

            // send the request(image) to FastAPI
            var response = await _httpClient.PostAsync(uploadUrl, formData);
            var responseContent = await response.Content.ReadAsStringAsync();

            Console.WriteLine($"FastAPI response status: {response.StatusCode}");
            Console.WriteLine($"FastAPI response content: {responseContent}");

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, new { message = $"Upload failed: {responseContent}" });
            }

            var uploadResponses = JsonSerializer.Deserialize<List<FastApiUploadResponse>>(responseContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (uploadResponses != null && uploadResponses.Count > 0)
            {
                var uploadResponse = uploadResponses[0];
                var fullUrl = $"http://mangaserver.ddnsfree.com:5001{uploadResponse.preview_url}";

                Console.WriteLine($"Constructed full URL: {fullUrl}");

                return Ok(new { url = fullUrl, message = "Image uploaded successfully" });
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

    [HttpPost("audio")] // same logic
    public async Task<IActionResult> UploadAudio(IFormFile file, [FromQuery] string userId)
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

            Console.WriteLine($"Uploading audio: {file.FileName} for user: {userId}");

            var formData = new MultipartFormDataContent();
            var fileContent = new StreamContent(file.OpenReadStream());
            fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(file.ContentType);
            formData.Add(fileContent, "files", file.FileName);

            var folder = $"custom/{userId}";
            var uploadUrl = $"http://mangaserver.ddnsfree.com:5001/upload/audio?folder={Uri.EscapeDataString(folder)}";

            Console.WriteLine($"Forwarding to FastAPI: {uploadUrl}");

            var response = await _httpClient.PostAsync(uploadUrl, formData);
            var responseContent = await response.Content.ReadAsStringAsync();

            Console.WriteLine($"FastAPI response status: {response.StatusCode}");
            Console.WriteLine($"FastAPI response content: {responseContent}");

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, new { message = $"Upload failed: {responseContent}" });
            }

            var uploadResponses = JsonSerializer.Deserialize<List<FastApiUploadResponse>>(responseContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (uploadResponses != null && uploadResponses.Count > 0)
            {
                var uploadResponse = uploadResponses[0];
                var fullUrl = $"http://mangaserver.ddnsfree.com:5001{uploadResponse.preview_url}";

                Console.WriteLine($"Constructed full URL: {fullUrl}");

                return Ok(new { url = fullUrl, message = "Audio uploaded successfully" });
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

public class FastApiUploadResponse // helper class to represent the JSON response from FastAPI
{
    public string message { get; set; } = string.Empty;
    public string preview_url { get; set; } = string.Empty;
}