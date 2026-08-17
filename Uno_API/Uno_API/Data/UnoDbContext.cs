using Microsoft.EntityFrameworkCore;
using Uno_API.Models;

namespace Uno_API.Data
{
    public class UnoDbContext : DbContext
    {
        public UnoDbContext(DbContextOptions<UnoDbContext> options) : base(options) { }

        // Core domain
        public DbSet<Client> Clients { get; set; } = null!;
        public DbSet<Project> Projects { get; set; } = null!;
        public DbSet<Tour> Tours { get; set; } = null!;
        public DbSet<Passenger> Passengers { get; set; } = null!;
        public DbSet<TourStatus> TourStatuses { get; set; } = null!;
        public DbSet<ProjectStatus> ProjectStatuses { get; set; } = null!;
        public DbSet<ServiceCategory> ServiceCategories { get; set; } = null!;
        public DbSet<TourService> TourServices { get; set; } = null!;

        // Master data
        public DbSet<Hotel> Hotels { get; set; } = null!;
        public DbSet<Guide> Guides { get; set; } = null!;
        public DbSet<TransportCompany> TransportCompanies { get; set; } = null!;
        public DbSet<Driver> Drivers { get; set; } = null!;
        public DbSet<Excursion> Excursions { get; set; } = null!;
        public DbSet<Vendor> Vendors { get; set; } = null!;
        public DbSet<ExcursionVendor> ExcursionVendors { get; set; } = null!;

        // Bookings & Collections & Invoices & Users
        public DbSet<Booking> Bookings { get; set; } = null!;
        public DbSet<Collection> Collections { get; set; } = null!;
        public DbSet<SalesTracker> SalesTrackers { get; set; } = null!;
        public DbSet<Invoice> Invoices { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<AuditLog> AuditLogs { get; set; } = null!;
        public DbSet<RolePermission> RolePermissions { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Driver>().Property(x => x.DailyRate).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Excursion>().Property(x => x.Price).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Excursion>().Property(x => x.SalePrice).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Guide>().Property(x => x.DailyRate).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Hotel>().Property(x => x.SingleRate).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Hotel>().Property(x => x.DoubleRate).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Hotel>().Property(x => x.TwinRate).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Hotel>().Property(x => x.TripleRate).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Project>().Property(x => x.ApproxBudget).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<TourService>().Property(x => x.Quantity).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<TransportCompany>().Property(x => x.DailyRate).HasColumnType("decimal(18,2)");

            foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.Restrict;
            }

            // Seed ServiceCategories
            modelBuilder.Entity<ServiceCategory>().HasData(
                new ServiceCategory { Id = 1, Name = "Hotel", Type = "Expense", Classification = "Standard" },
                new ServiceCategory { Id = 2, Name = "Flight", Type = "Expense", Classification = "Standard" },
                new ServiceCategory { Id = 3, Name = "Transport", Type = "Expense", Classification = "Standard" },
                new ServiceCategory { Id = 4, Name = "Guide", Type = "Expense", Classification = "Standard" },
                new ServiceCategory { Id = 5, Name = "Driver", Type = "Expense", Classification = "Standard" },
                new ServiceCategory { Id = 6, Name = "Excursion", Type = "Revenue", Classification = "Extra" },
                new ServiceCategory { Id = 7, Name = "Tour Package Fee", Type = "Revenue", Classification = "Extra" },
                new ServiceCategory { Id = 8, Name = "Client Flat Invoice", Type = "Revenue", Classification = "Extra" },
                new ServiceCategory { Id = 9, Name = "Parking", Type = "Expense", Classification = "Other" },
                new ServiceCategory { Id = 10, Name = "Tips", Type = "Expense", Classification = "Other" },
                new ServiceCategory { Id = 11, Name = "City Tax", Type = "Revenue", Classification = "Other" }
            );

            // Seed TourStatuses
            modelBuilder.Entity<TourStatus>().HasData(
                new TourStatus { Id = 1, Name = "Draft", OrderIndex = 1 },
                new TourStatus { Id = 2, Name = "Proposal", OrderIndex = 2 },
                new TourStatus { Id = 3, Name = "Confirmed", OrderIndex = 3 },
                new TourStatus { Id = 4, Name = "In Progress", OrderIndex = 4 },
                new TourStatus { Id = 5, Name = "Completed", OrderIndex = 5 },
                new TourStatus { Id = 6, Name = "Cancelled", OrderIndex = 6 }
            );

            // Seed ProjectStatuses
            modelBuilder.Entity<ProjectStatus>().HasData(
                new ProjectStatus { Id = 1, Name = "Draft", OrderIndex = 1 },
                new ProjectStatus { Id = 2, Name = "Planning", OrderIndex = 2 },
                new ProjectStatus { Id = 3, Name = "Active", OrderIndex = 3 },
                new ProjectStatus { Id = 4, Name = "On Hold", OrderIndex = 4 },
                new ProjectStatus { Id = 5, Name = "Completed", OrderIndex = 5 },
                new ProjectStatus { Id = 6, Name = "Cancelled", OrderIndex = 6 }
            );

            // Seed missing master data
            modelBuilder.Entity<TransportCompany>().HasData(new TransportCompany { Id = 1, Name = "Sample Transport Co.", Email = "info@transport.com", FleetSize = 15, DailyRate = 150m });
            modelBuilder.Entity<Driver>().HasData(new Driver { Id = 1, Name = "John Doe", PhoneNumber = "123-456-7890", DailyRate = 50m, TransportCompanyId = 1 });
            modelBuilder.Entity<Vendor>().HasData(new Vendor { Id = 1, Name = "Sample Vendor", Email = "vendor@test.com", ServiceType = "Catering" });
            modelBuilder.Entity<Excursion>().HasData(new Excursion { Id = 1, Name = "City Tour", Type = "Half Day", Price = 30m, SalePrice = 50m });
            modelBuilder.Entity<Guide>().HasData(new Guide { Id = 1, Name = "Jane Smith", Language = "English", PhoneNumber = "098-765-4321", DailyRate = 100m });

            // Seed Users
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Email = "evren@uno-dmc.cz", Password = "FenerliDerya@1907", Name = "Evren", Role = "Administrator", IsActive = true, CreatedAt = DateTime.SpecifyKind(new DateTime(2026, 8, 1, 0, 0, 0), DateTimeKind.Utc) },
                new User { Id = 2, Email = "gersencelebi@gmail.com", Password = "FenerliErsen@1907", Name = "G. Ersen Çelebi", Role = "Administrator", IsActive = true, CreatedAt = DateTime.SpecifyKind(new DateTime(2026, 8, 1, 0, 0, 0), DateTimeKind.Utc) },
                new User { Id = 3, Email = "tuana@uno-dmc.cz", Password = "medCezir@1993", Name = "Tuana", Role = "Administrator", IsActive = true, CreatedAt = DateTime.SpecifyKind(new DateTime(2026, 8, 12, 0, 0, 0), DateTimeKind.Utc) },
                new User { Id = 4, Email = "deniz.evren@uno-dmc.cz", Password = "FenerliDeniz@1907", Name = "Deniz Evren", Role = "Administrator", IsActive = true, CreatedAt = DateTime.SpecifyKind(new DateTime(2026, 8, 12, 0, 0, 0), DateTimeKind.Utc) }
            );
        }
    }
}
