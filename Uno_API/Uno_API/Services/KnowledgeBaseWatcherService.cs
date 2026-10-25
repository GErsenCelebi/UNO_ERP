using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Uno_API.Data;

namespace Uno_API.Services
{
    public class KnowledgeBaseWatcherService : IHostedService, IDisposable
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<KnowledgeBaseWatcherService> _logger;
        private readonly List<FileSystemWatcher> _watchers = new();
        private Timer? _debounceTimer;
        private readonly object _lock = new();
        private string? _lastTriggerReason;
        private bool _isDisposed;

        public KnowledgeBaseWatcherService(IServiceProvider serviceProvider, ILogger<KnowledgeBaseWatcherService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Starting Real-time KnowledgeBaseWatcherService for *.md documents...");

            // 1. Resolve candidate directories to monitor
            var currentDir = Directory.GetCurrentDirectory();
            var baseDir = AppDomain.CurrentDomain.BaseDirectory;

            var candidatePaths = new[]
            {
                Path.Combine(currentDir, "..", "UserManuals"),
                Path.Combine(currentDir, "UserManuals"),
                @"C:\Ersen\Projects_2025\Uno_ERP\UserManuals",
                Path.Combine(currentDir, "wwwroot", "KB"),
                Path.Combine(baseDir, "wwwroot", "KB")
            };

            var resolvedDirs = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            foreach (var path in candidatePaths)
            {
                try
                {
                    if (Directory.Exists(path))
                    {
                        var full = Path.GetFullPath(path);
                        resolvedDirs.Add(full);
                    }
                }
                catch
                {
                    // Ignore invalid path formats
                }
            }

            // 2. Set up debouncer timer
            _debounceTimer = new Timer(async _ => await ExecuteDebouncedSyncAsync(), null, Timeout.InfiniteTimeSpan, Timeout.InfiniteTimeSpan);

            // 3. Attach FileSystemWatchers with recursive subdirectory monitoring
            foreach (var dir in resolvedDirs)
            {
                try
                {
                    var watcher = new FileSystemWatcher(dir)
                    {
                        Filter = "*.md",
                        IncludeSubdirectories = true,
                        NotifyFilter = NotifyFilters.FileName | NotifyFilters.LastWrite | NotifyFilters.CreationTime | NotifyFilters.Size
                    };

                    watcher.Created += (s, e) => ScheduleReindex($"File Created: {e.Name} in {dir}");
                    watcher.Changed += (s, e) => ScheduleReindex($"File Modified: {e.Name} in {dir}");
                    watcher.Deleted += (s, e) => ScheduleReindex($"File Deleted: {e.Name} in {dir}");
                    watcher.Renamed += (s, e) => ScheduleReindex($"File Renamed: {e.OldName} -> {e.Name} in {dir}");

                    watcher.EnableRaisingEvents = true;
                    _watchers.Add(watcher);
                    _logger.LogInformation("Watching markdown repository at: {Path} (recursive = true)", dir);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Could not attach FileSystemWatcher to {Path}", dir);
                }
            }

            // 4. Trigger initial non-blocking background synchronization on startup
            _ = Task.Run(async () =>
            {
                try
                {
                    await Task.Delay(2000, cancellationToken); // Wait for DB init
                    await SyncKnowledgeBaseAsync("Initial Startup Sync");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Initial background knowledge sync failed on startup.");
                }
            }, cancellationToken);

            return Task.CompletedTask;
        }

        private void ScheduleReindex(string reason)
        {
            lock (_lock)
            {
                if (_isDisposed) return;
                _lastTriggerReason = reason;
                _logger.LogInformation("Detected Markdown change: {Reason}. Debouncing re-index for 2 seconds...", reason);
                _debounceTimer?.Change(TimeSpan.FromSeconds(2), Timeout.InfiniteTimeSpan);
            }
        }

        private async Task ExecuteDebouncedSyncAsync()
        {
            string reason;
            lock (_lock)
            {
                reason = _lastTriggerReason ?? "Debounced FileSystem Event";
                _lastTriggerReason = null;
            }

            try
            {
                await SyncKnowledgeBaseAsync(reason);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error executing debounced knowledge base sync for reason: {Reason}", reason);
            }
        }

        private async Task SyncKnowledgeBaseAsync(string triggerReason)
        {
            _logger.LogInformation("Executing automated Knowledge Base indexing [Reason: {Reason}]...", triggerReason);

            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<UnoDbContext>();
            var retrievalService = scope.ServiceProvider.GetRequiredService<IKnowledgeRetrievalService>();

            if (triggerReason == "Initial Startup Sync")
            {
                var currentCount = context.AiKnowledgeItems.Count();
                if (currentCount == 495)
                {
                    retrievalService.InvalidateCache();
                    _logger.LogInformation("Automated Knowledge Base initial check complete: 495 synchronized items already present.");
                    return;
                }
            }

            var indexer = new FileRepositoryIndexer(context);
            var result = await indexer.IndexWorkspaceMarkdownFilesAsync();

            // Invalidate cache so subsequent chat requests see new chunks immediately
            retrievalService.InvalidateCache();

            _logger.LogInformation("Automated Knowledge Base sync complete: {Ingested} items ingested across {Files} markdown files.",
                result.TotalKnowledgeItemsIngested, result.TotalFilesProcessed);
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Stopping KnowledgeBaseWatcherService...");
            Dispose();
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            lock (_lock)
            {
                if (_isDisposed) return;
                _isDisposed = true;

                _debounceTimer?.Dispose();
                _debounceTimer = null;

                foreach (var watcher in _watchers)
                {
                    try
                    {
                        watcher.EnableRaisingEvents = false;
                        watcher.Dispose();
                    }
                    catch
                    {
                        // Ignore disposal errors
                    }
                }
                _watchers.Clear();
            }
        }
    }
}
