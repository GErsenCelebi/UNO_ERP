# Test Execution Matrix & Granular Results

**Suite Name:** `Uno_API.Tests`  
**Framework:** xUnit.net 2.9.3 + Microsoft.EntityFrameworkCore.InMemory 10.0.9 + Moq 4.20.72  
**Assembly:** `bin\Debug\net10.0\Uno_API.Tests.dll`  
**Execution Time:** 888 ms  

---

## 📋 Comprehensive Test Inventory

| # | PBI ID | Test Method Name | Suite Partition | Component Under Test | Status | Duration |
| :- | :--- | :--- | :--- | :--- | :---: | :---: |
| 1 | PBI10 | `Test_PBI10_GetHotels_ReturnsEmpty` | ApiRegression | `HotelsController` | **PASS** | < 10ms |
| 2 | PBI10 | `Test_PBI10_PostHotel_ReturnsSuccess` | ApiRegression | `HotelsController` | **PASS** | < 10ms |
| 3 | PBI10 | `Test_PBI10_PostGuide_ReturnsSuccess` | ApiRegression | `GuidesController` | **PASS** | < 10ms |
| 4 | PBI10 | `Test_PBI10_PostVehicle_ReturnsSuccess` | ApiRegression | `VehiclesController` | **PASS** | < 10ms |
| 5 | PBI10 | `Test_PBI10_PostSupplier_ReturnsSuccess` | ApiRegression | `SuppliersController` | **PASS** | < 10ms |
| 6 | PBI10 | `Test_PBI10_PostClient_ReturnsSuccess` | ApiRegression | `ClientsController` | **PASS** | < 10ms |
| 7 | PBI10 | `Test_PBI10_PostTourType_ReturnsSuccess` | ApiRegression | `TourTypesController` | **PASS** | < 10ms |
| 8 | PBI11 | `Test_PBI11_GetProjects_ReturnsEmpty` | ApiRegression | `ProjectsController` | **PASS** | < 10ms |
| 9 | PBI11 | `Test_PBI11_PostProject_ReturnsSuccess` | ApiRegression | `ProjectsController` | **PASS** | < 10ms |
| 10 | PBI11 | `Test_PBI11_PostProject_CreatesFolderViaStorageService` | CurrentSprintApi | `ProjectsController` + `IStorageService` | **PASS** | < 10ms |
| 11 | PBI11 | `Test_PBI11_GetProjectById_NotFound_Returns404` | ApiRegression | `ProjectsController` | **PASS** | < 10ms |
| 12 | PBI12 | `Test_PBI12_GetTours_ReturnsEmpty` | CurrentSprintApi | `ToursController` | **PASS** | < 10ms |
| 13 | PBI12 | `Test_PBI12_PostTour_ReturnsSuccess` | CurrentSprintApi | `ToursController` + `IStorageService` | **PASS** | < 10ms |
| 14 | PBI12 | `Test_PBI12_GetTourById_NotFound_Returns404` | ApiRegression | `ToursController` | **PASS** | < 10ms |
| 15 | PBI12 | `Test_PBI12_GetTourStatuses_ReturnsOrderedList` | ApiRegression | `TourStatusesController` | **PASS** | < 10ms |
| 16 | PBI12 | `Test_PBI12_PostTourStatus_ReturnsCreatedAt` | CurrentSprintApi | `TourStatusesController` | **PASS** | < 10ms |
| 17 | PBI13 | `Test_PBI13_UploadTours_NullFile_ReturnsBadRequest` | ApiRegression | `ExcelImportController` | **PASS** | < 10ms |
| 18 | PBI13 | `Test_PBI13_UploadTours_EmptyFile_ReturnsBadRequest` | CurrentSprintApi | `ExcelImportController` | **PASS** | < 10ms |
| 19 | PBI14 | `Test_PBI14_SanitizeFolderName_ProducesValidDirectoryName (4 cases)` | ApiRegression | `StorageService` | **PASS** | < 10ms |
| 20 | PBI14 | `Test_PBI14_EnsureTourFolders_CreatesRequiredSubdirectories` | CurrentSprintApi | `StorageService` | **PASS** | < 15ms |
| 21 | PBI14 | `Test_PBI14_SaveImportStreamAsync_WritesFileCorrectly` | CurrentSprintApi | `StorageService` | **PASS** | < 20ms |
| 22 | PBI15 | `Test_PBI15_GetCalendarEvents_ExactSameDayOverlap_SetsHasGuideConflictTrue` | ApiRegression | `TourCalendarController` | **PASS** | < 25ms |
| 23 | PBI15 | `Test_PBI15_GetCalendarEvents_PartialOverlap_SetsHasGuideConflictTrue` | ApiRegression | `TourCalendarController` | **PASS** | < 10ms |
| 24 | PBI15 | `Test_PBI15_GetCalendarEvents_NoOverlap_SetsHasGuideConflictFalse` | ApiRegression | `TourCalendarController` | **PASS** | < 10ms |

---

## 📈 Quality Summary

- **Total Asserts Evaluated:** 58 assertions
- **Failures / Errors:** 0
- **Pass Rate:** 100%
