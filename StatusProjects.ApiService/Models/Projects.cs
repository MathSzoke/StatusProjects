namespace StatusProjects.ApiService.Models;

public enum Status
{
    Active,
    LowActivity,
    Inactive
}

public class Projects
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string UrlRedirect { get; set; }
    public required string UrlEndpoint { get; set; }
    public int Latency { get; set; } // in ms
    public Status Status { get; set; }
}
