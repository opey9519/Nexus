using System.ComponentModel.DataAnnotations;

namespace NexusAPI.Models;

// Food Entries contain a Secondary Key binded to a User
public class FoodEntries
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string UserId { get; set; }
    public string? FoodName { get; set; }
    public int Calories { get; set; }
    public float Protein { get; set; }
    public float Carbohydrates { get; set; }
    public float Fats { get; set; }
    public DateTime EatenAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}