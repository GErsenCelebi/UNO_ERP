namespace Uno_API.Models
{
    public class TourStatusCheckpoint
    {
        public int Id { get; set; }
        public int TargetStatusId { get; set; }
        public string CheckpointKey { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsMandatory { get; set; } = true;
        public int? WarningThresholdDays { get; set; }

        public TourStatus? TargetStatus { get; set; }
    }
}
