namespace Uno_API.Models
{
    public class Hotel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Location { get; set; } = string.Empty;
        public int StarRating { get; set; }
        
        // Contact Fields
        public string? ContactName { get; set; } = string.Empty;
        public string? ContactRole { get; set; } = string.Empty;
        public string? Email { get; set; } = string.Empty;
        public string? Phone { get; set; } = string.Empty;
        // Rate Fields
        public decimal SingleRoomRate { get; set; }
        public decimal SinglePaxRate { get; set; }
        public decimal DoubleRoomRate { get; set; }
        public decimal DoublePaxRate { get; set; }
        public decimal TwinRoomRate { get; set; }
        public decimal TwinPaxRate { get; set; }
        public decimal TripleRoomRate { get; set; }
        public decimal TriplePaxRate { get; set; }
        public string? PricingBasis { get; set; } = "Pax";

        // Backwards compatibility properties (Pax Rate)
        public decimal SingleRate 
        { 
            get => SinglePaxRate > 0 ? SinglePaxRate : SingleRoomRate; 
            set { SinglePaxRate = value; SingleRoomRate = value; } 
        }
        public decimal DoubleRate 
        { 
            get => DoublePaxRate > 0 ? DoublePaxRate : (DoubleRoomRate > 0 ? DoubleRoomRate / 2 : 0); 
            set { DoublePaxRate = value; DoubleRoomRate = value * 2; } 
        }
        public decimal TwinRate 
        { 
            get => TwinPaxRate > 0 ? TwinPaxRate : (TwinRoomRate > 0 ? TwinRoomRate / 2 : 0); 
            set { TwinPaxRate = value; TwinRoomRate = value * 2; } 
        }
        public decimal TripleRate 
        { 
            get => TriplePaxRate > 0 ? TriplePaxRate : (TripleRoomRate > 0 ? TripleRoomRate / 3 : 0); 
            set { TriplePaxRate = value; TripleRoomRate = value * 3; } 
        }
    }
}
