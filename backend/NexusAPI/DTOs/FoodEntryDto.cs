namespace NexusAPI.DTOs;

public class CreateFoodEntryDto
{
    public string? FoodName { get; set; }
    public int Calories { get; set; }
    public float Protein { get; set; }
    public float Carbohydrates { get; set; }
    public float Fats { get; set; }
    public DateTime EatenAt { get; set; }
}

public class FoodEntryDto
{
    public Guid Id { get; set; }
    public string? FoodName { get; set; }
    public int Calories { get; set; }
    public float Protein { get; set; }
    public float Carbohydrates { get; set; }
    public float Fats { get; set; }
    public DateTime EatenAt { get; set; }
}

public class UpdateFoodEntryDto
{
    public string? FoodName { get; set; }
    public int? Calories { get; set; }
    public float? Protein { get; set; }
    public float? Carbohydrates { get; set; }
    public float? Fats { get; set; }
    public DateTime? EatenAt { get; set; }
}