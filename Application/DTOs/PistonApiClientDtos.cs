namespace Application.DTOs
{
    public class PistonExecuteRequest
    {
        public string Language { get; set; } = null!;
        public string Version { get; set; } = null!;
        public string Code { get; set; } = null!;
    }

    public class PistonExecuteResponse
    {
        public string? RunOutput { get; set; }
        public string? RunStderr { get; set; }
        public int? ExitCode { get; set; }
    }

    public class PistonRuntimeResponse
    {
        public string language { get; set; }
        public string version { get; set; }
        public string[] aliases { get; set; }
        public string? runtime { get; set; }
    }

}
