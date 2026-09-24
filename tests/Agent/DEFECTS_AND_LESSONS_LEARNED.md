# Defects Triage & Lessons Learned

**Owner:** QA Automation Manager & Tech Lead  
**Document:** `DEFECTS_AND_LESSONS_LEARNED.md`  
**Status:** All Defects Closed  

---

## 🐛 Defects Identified and Resolved

### 1. [COMPILATION] Missing `IStorageService` Constructor Parameter in Test Classes
* **Severity:** Critical (Build Blocker)
* **Root Cause:** When `ProjectsController` and `ToursController` were enhanced to support automatic project/tour folder scaffolding via `IStorageService`, existing test classes (`ProjectsControllersTests.cs` and `ToursControllersTests.cs`) were not updated with the new dependency.
* **Resolution:**
  - Added an optional fallback constructor `public ProjectsController(UnoDbContext context) : this(context, null!)` and `public ToursController(UnoDbContext context) : this(context, null!)` in both controllers.
  - Added null-conditional operators `_storageService?.EnsureProjectFolder(...)` and `_storageService?.EnsureTourFolders(...)`.
  - Updated unit test classes to inject `Mock<IStorageService>` and verify interaction using `mockStorage.Verify(...)`.

### 2. [COMPILATION] `IActionResult` Untyped `.Value` Call in `ProjectsControllersTests.cs`
* **Severity:** High (Compiler Error CS1061)
* **Root Cause:** `ProjectsController.GetProjects()` returns `Task<IActionResult>` with `Ok(projects)`. The test method called `result.Value` directly without casting to `OkObjectResult`.
* **Resolution:** Cast `result` to `OkObjectResult` and assert `IEnumerable` payload:
  ```csharp
  var okResult = Assert.IsType<OkObjectResult>(result);
  var list = Assert.IsAssignableFrom<IEnumerable>(okResult.Value);
  Assert.Empty(list);
  ```

### 3. [BUG / POTENTIAL RUNTIME ERROR] Unchecked `Stream.Position = 0` in `StorageService.cs`
* **Severity:** Medium (Stream Exception Risk)
* **Root Cause:** In `SaveImportStreamAsync`, `fileStream.Position = 0` was invoked unconditionally. Calling `Position` on a non-seekable stream (e.g. forward-only network stream or request body) throws a `NotSupportedException`.
* **Resolution:** Guarded with `if (fileStream.CanSeek) { fileStream.Position = 0; }`.

### 4. [FLAWED TEST IDENTIFIED] EF Core In-Memory Foreign Key Join Filtering in `TourCalendarControllerTests.cs`
* **Severity:** High (3 Test Failures)
* **Root Cause:** `TourCalendarController.GetCalendarEvents` includes `.Include(t => t.TourStatus)` and `.Include(t => t.TourServices).ThenInclude(ts => ts.ServiceCategory)`. Because `TourStatusId` and `ServiceCategoryId` are non-nullable foreign keys, EF Core executes an inner join. The tests did not seed `TourStatus` or `ServiceCategory`, causing all test tours to be excluded and returning 0 results.
* **Resolution:** Added initial lookups (`TourStatus` and `ServiceCategory`) inside `GetInMemoryDbContext()` and assigned valid IDs to all test entities.

### 5. [BUILD PROCESS] Locked `Uno_API.dll` by Background `dotnet.exe`
* **Severity:** High (Build Blocker MSB3027)
* **Root Cause:** `stop-uno-api.ps1` only targeted processes named `Uno_API`. When running with `dotnet run`, the process name is `dotnet` with command line containing `Uno_API.dll`.
* **Resolution:** Enhanced `stop-uno-api.ps1` to inspect WMI process command lines and terminate any `dotnet` process hosting `Uno_API.dll`.

---

## 💡 Lessons Learned & Process Enhancements

1. **Rule for Controller Refactoring:** Whenever a controller's constructor is modified to accept a new service, provide an optional overload or immediately search for all unit/integration test instantiations to prevent broken builds.
2. **Defensive DI Execution:** Never assume an injected dependency will always be present in unit test fixtures; use null-conditional operators or guard clauses where non-critical side effects (like folder scaffolding) take place.
3. **Seeding in InMemory Tests:** When testing EF Core queries that use `.Include()` on entities with non-nullable foreign keys, always ensure the corresponding lookup tables have matching seeded records.
