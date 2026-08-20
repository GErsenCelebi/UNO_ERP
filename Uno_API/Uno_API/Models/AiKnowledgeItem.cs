using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Uno_API.Models
{
    [Table("AiKnowledgeItems")]
    public class AiKnowledgeItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string SourceType { get; set; } = "DocumentationRepo"; // "DocumentationRepo", "UserManual", "ManualEntry"

        [StringLength(250)]
        public string? SourceFile { get; set; } // e.g. "UNO_ERP_User_Manual.md", "Uno_Tour_Status_Transition_Process_Flows.md"

        [Required]
        [StringLength(100)]
        public string Category { get; set; } = "General"; // "Governance", "Process Flow", "How-To", "System Specification"

        [Required]
        [StringLength(500)]
        public string QuestionPattern { get; set; } = string.Empty; // e.g. "How to set tour status as completed?"

        [Required]
        public string Keywords { get; set; } = string.Empty; // comma-separated search terms e.g. "completed, status, transition, criteria"

        [Required]
        public string AnswerMarkdown { get; set; } = string.Empty; // Full markdown response text extracted from document

        [StringLength(250)]
        public string? TargetUrl { get; set; } // e.g. "/tours", "/master-data"

        [StringLength(100)]
        public string? ActionLabel { get; set; } // e.g. "Open Tours Grid"

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
