using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;
using Uno_API.Data;

namespace Uno_API.Services
{
    public class StorageMigrationService : IHostedService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<StorageMigrationService> _logger;

        public StorageMigrationService(IServiceProvider serviceProvider, ILogger<StorageMigrationService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Starting Automated Storage Hierarchy Initialization & Consolidation Migration...");

            try
            {
                using var scope = _serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<UnoDbContext>();
                var storageService = scope.ServiceProvider.GetRequiredService<IStorageService>();

                var rootPath = storageService.GetRootPath();
                _logger.LogInformation("Root Storage Path resolved: {RootPath}", rootPath);

                var projects = await context.Projects.Include(p => p.Tours).ToListAsync(cancellationToken);

                int projectsProcessed = 0;
                int toursProcessed = 0;

                foreach (var proj in projects)
                {
                    if (string.IsNullOrWhiteSpace(proj.ProjectCode)) continue;

                    var projDir = storageService.EnsureProjectFolder(proj.ProjectCode);
                    projectsProcessed++;

                    if (proj.Tours != null)
                    {
                        foreach (var tour in proj.Tours)
                        {
                            if (string.IsNullOrWhiteSpace(tour.TourCode)) continue;

                            storageService.EnsureTourFolders(proj.ProjectCode, tour.TourCode);
                            toursProcessed++;
                        }
                    }
                }

                _logger.LogInformation("Storage Consolidation Migration complete! Ensured folders for {Projects} Projects and {Tours} Tours.", projectsProcessed, toursProcessed);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during Storage Migration: {Message}", ex.Message);
            }
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }
}
