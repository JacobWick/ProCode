using Application.DTOs;
using Application.Interfaces;
using System.Net.Http.Json;
using System.Text.Json;

namespace Infrastructure.Clients
{
    public class PistonApiClient : IPistonApiClient
    {
        private readonly HttpClient _httpClient;

        public PistonApiClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<PistonExecuteResponse> ExecuteAsync(PistonExecuteRequest request, CancellationToken cancellationToken = default)
        {
            var body = new
            {
                language = request.Language,
                version = request.Version,
                files = new[]
                {
                new { name = "code", content = request.Code }
            }
            };

            var response = await _httpClient.PostAsJsonAsync("/api/v2/piston/execute", body, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Piston execution failed: {response.StatusCode}");
            }

            var result = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken);

            return new PistonExecuteResponse
            {
                RunOutput = result.GetProperty("run").GetProperty("stdout").GetString(),
                RunStderr = result.GetProperty("run").GetProperty("stderr").GetString(),
                ExitCode = result.GetProperty("run").GetProperty("code").GetInt32()
            };
        }

        public async Task<List<PistonRuntimeResponse>> GetSupportedLanguagesAsync(CancellationToken cancellationToken = default)
        {
            var response = await _httpClient.GetAsync("/api/v2/piston/runtimes", cancellationToken);
            
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Failed to fetch supported languages: {response.StatusCode}");
            }

            var result = await response.Content.ReadFromJsonAsync<List<PistonRuntimeResponse>>(cancellationToken);

            if (result is null)
            {
                throw new Exception("Failed to parse supported languages response.");
            }

            return result;
        }
    }
}
