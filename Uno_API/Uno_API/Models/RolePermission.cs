namespace Uno_API.Models
{
    public class RolePermission
    {
        public int Id { get; set; }
        public string RoleName { get; set; } = string.Empty;
        public string ScreenKey { get; set; } = string.Empty;
        public bool CanView { get; set; } = true;
        public bool CanEntry { get; set; } = false;
        public bool CanUpdate { get; set; } = false;
        public bool CanDelete { get; set; } = false;
    }
}
