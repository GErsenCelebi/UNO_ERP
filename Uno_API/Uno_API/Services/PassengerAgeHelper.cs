using System;

namespace Uno_API.Services
{
    public static class PassengerAgeHelper
    {
        public const int ChildMaxAge = 12; // Lower than 12 years old is marked as children; 12 and above are adult

        /// <summary>
        /// Calculates the exact calendar age in whole years from birthDate to referenceDate.
        /// </summary>
        public static int CalculateAge(DateTime birthDate, DateTime referenceDate)
        {
            int age = referenceDate.Year - birthDate.Year;
            if (referenceDate.Month < birthDate.Month || (referenceDate.Month == birthDate.Month && referenceDate.Day < birthDate.Day))
            {
                age--;
            }
            return age;
        }

        /// <summary>
        /// Determines whether a passenger should be treated as a child (under 12 years old).
        /// If DateOfBirth is provided, exact calendar age relative to referenceDate takes precedence.
        /// Otherwise, falls back to PaxType keywords.
        /// </summary>
        public static bool IsChild(DateTime? birthDate, string? paxType, DateTime referenceDate)
        {
            if (birthDate.HasValue)
            {
                return CalculateAge(birthDate.Value, referenceDate) < ChildMaxAge;
            }

            if (!string.IsNullOrWhiteSpace(paxType))
            {
                var pt = paxType.ToUpperInvariant();
                return pt.Contains("CHILD") || pt.Contains("CHD") || pt.Contains("ÇOCUK") || pt.Contains("COCUK");
            }

            return false;
        }

        /// <summary>
        /// Returns the standardized PaxType ("Children", "Adult", or "Infant") based on birthDate or existing type.
        /// </summary>
        public static string DeterminePaxType(DateTime? birthDate, string? existingPaxType, DateTime referenceDate)
        {
            if (birthDate.HasValue)
            {
                int age = CalculateAge(birthDate.Value, referenceDate);
                if (age < 2) return "Infant";
                if (age < ChildMaxAge) return "Children";
                return "Adult";
            }

            if (!string.IsNullOrWhiteSpace(existingPaxType))
            {
                var pt = existingPaxType.ToUpperInvariant();
                if (pt.Contains("CHILD") || pt.Contains("CHD") || pt.Contains("ÇOCUK") || pt.Contains("COCUK"))
                {
                    return "Children";
                }
                if (pt.Contains("INFANT") || pt.Contains("BEBEK") || pt.Contains("INF"))
                {
                    return "Infant";
                }
                return "Adult";
            }

            return "Adult";
        }
    }
}
