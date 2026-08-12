using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Rewrite;
using System.Text.Json.Serialization;
using Uno_API.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

var initializeDatabaseOnStartup =
    builder.Configuration.GetValue<bool?>("InitializeDatabaseOnStartup")
    ?? builder.Environment.IsDevelopment();

// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(x =>
    x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<UnoDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure CORS for Next.js UI
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

var app = builder.Build();

if (initializeDatabaseOnStartup)
{
    using (var dbScope = app.Services.CreateScope())
    {
        var db = dbScope.ServiceProvider.GetRequiredService<UnoDbContext>();
        // Make sure database exists
        db.Database.EnsureCreated();
        
        try {
            db.Database.ExecuteSqlRaw(@"
                IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Tours_Guides_GuideId')
                BEGIN
                    ALTER TABLE [Tours] DROP CONSTRAINT [FK_Tours_Guides_GuideId];
                END
                
                IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tours_GuideId')
                BEGIN
                    DROP INDEX [IX_Tours_GuideId] ON [Tours];
                END

                IF EXISTS (SELECT * FROM sys.columns WHERE Name = N'GuideId' AND Object_ID = Object_ID(N'Tours'))
                BEGIN
                    ALTER TABLE [Tours] DROP COLUMN [GuideId];
                END

                IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'ServiceEndDate' AND Object_ID = Object_ID(N'TourServices'))
                BEGIN
                    ALTER TABLE [TourServices] ADD [ServiceEndDate] datetime2 NULL;
                END

                IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'SingleRoomRate' AND Object_ID = Object_ID(N'Hotels'))
                BEGIN
                    ALTER TABLE [Hotels] ADD [SingleRoomRate] decimal(18,2) NOT NULL DEFAULT 0;
                    ALTER TABLE [Hotels] ADD [SinglePaxRate] decimal(18,2) NOT NULL DEFAULT 0;
                    ALTER TABLE [Hotels] ADD [DoubleRoomRate] decimal(18,2) NOT NULL DEFAULT 0;
                    ALTER TABLE [Hotels] ADD [DoublePaxRate] decimal(18,2) NOT NULL DEFAULT 0;
                    ALTER TABLE [Hotels] ADD [TwinRoomRate] decimal(18,2) NOT NULL DEFAULT 0;
                    ALTER TABLE [Hotels] ADD [TwinPaxRate] decimal(18,2) NOT NULL DEFAULT 0;
                    ALTER TABLE [Hotels] ADD [TripleRoomRate] decimal(18,2) NOT NULL DEFAULT 0;
                    ALTER TABLE [Hotels] ADD [TriplePaxRate] decimal(18,2) NOT NULL DEFAULT 0;
                    ALTER TABLE [Hotels] ADD [PricingBasis] nvarchar(max) NULL DEFAULT 'Pax';
                END

                UPDATE Hotels SET PricingBasis = 'Pax' WHERE PricingBasis IS NULL;
                UPDATE Hotels SET ContactName = '' WHERE ContactName IS NULL;
                UPDATE Hotels SET ContactRole = '' WHERE ContactRole IS NULL;
                UPDATE Hotels SET Email = '' WHERE Email IS NULL;
                UPDATE Hotels SET Phone = '' WHERE Phone IS NULL;
                UPDATE Hotels SET Location = '' WHERE Location IS NULL;

                UPDATE ServiceCategories SET Name = 'Invoiced Fee' WHERE Id = 8;
                UPDATE ServiceCategories SET IsActive = 0 WHERE Id = 7;
            ");
        } catch (Exception ex) {
            Console.WriteLine("Error executing DB patch: " + ex.Message);
        }
    }
    using var scope = app.Services.CreateScope();
    var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("Startup");

    try
    {
        var context = scope.ServiceProvider.GetRequiredService<UnoDbContext>();
        context.Database.EnsureCreated();
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Database initialization failed during startup.");
    }
}

// Configure the HTTP request pipeline.
app.UseCors("AllowAll");

var options = new RewriteOptions()
    // Next.js RSC Data requests
    .AddRewrite(@"^_next/data/(.*)/projects/([^/]+)/tours/([^/]+)\.txt$", "_next/data/$1/projects/1/tours/1.txt", skipRemainingRules: true)
    .AddRewrite(@"^_next/data/(.*)/projects/([^/]+)\.txt$", "_next/data/$1/projects/1.txt", skipRemainingRules: true)
    // Initial HTML page loads
    .AddRewrite(@"^projects/([^/]+)/tours/([^/]+)/?$", "projects/1/tours/1.html", skipRemainingRules: true)
    .AddRewrite(@"^projects/([^/]+)/?$", "projects/1.html", skipRemainingRules: true);
app.UseRewriter(options);

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseAuthorization();
app.MapControllers();
app.MapOpenApi();
app.MapFallbackToFile("index.html");
app.MapGet("/api/debug-env", (IWebHostEnvironment env) => new {
    ContentRoot = env.ContentRootPath,
    WebRoot = env.WebRootPath,
    WebRootExists = System.IO.Directory.Exists(env.WebRootPath ?? ""),
    WebRootFiles = System.IO.Directory.Exists(env.WebRootPath ?? "") ? System.IO.Directory.GetFiles(env.WebRootPath) : new string[0],
    WebRootDirectories = System.IO.Directory.Exists(env.WebRootPath ?? "") ? System.IO.Directory.GetDirectories(env.WebRootPath) : new string[0],
    CurrentDirectory = System.IO.Directory.GetCurrentDirectory(),
    BaseDirectory = AppContext.BaseDirectory
});

app.Run();
