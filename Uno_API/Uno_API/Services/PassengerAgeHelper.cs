using System;

namespace Uno_API.Services
{
    public static class PassengerAgeHelper
    {
        public const int ChildMaxAge = 12; // Lower than 12 years old is marked as children; 12 and above are adult
        public const string BothBlankErrorMessage = "Both DoB and PaxType fields are blank please fill one at least of them";

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
        /// Checks whether at least one of birthDate or existingPaxType is provided.
        /// </summary>
        public static bool HasPaxClassification(DateTime? birthDate, string? existingPaxType)
        {
            return birthDate.HasValue || !string.IsNullOrWhiteSpace(existingPaxType);
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
        /// If DoB is filled: age >= 12 -> "Adult", age < 12 -> "Children" (and age < 2 -> "Infant"), even if paxType is blank.
        /// If DoB is blank but paxType is filled: evaluates paxType.
        /// If both are blank: throws InvalidOperationException with BothBlankErrorMessage.
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

            throw new InvalidOperationException(BothBlankErrorMessage);
        }

        /// <summary>
        /// Safely attempts to determine PaxType, returning false and setting errorMessage if both fields are blank.
        /// </summary>
        public static bool TryDeterminePaxType(DateTime? birthDate, string? existingPaxType, DateTime referenceDate, out string paxType, out string? errorMessage)
        {
            if (birthDate.HasValue)
            {
                int age = CalculateAge(birthDate.Value, referenceDate);
                paxType = age < 2 ? "Infant" : (age < ChildMaxAge ? "Children" : "Adult");
                errorMessage = null;
                return true;
            }

            if (!string.IsNullOrWhiteSpace(existingPaxType))
            {
                var pt = existingPaxType.ToUpperInvariant();
                if (pt.Contains("CHILD") || pt.Contains("CHD") || pt.Contains("ÇOCUK") || pt.Contains("COCUK"))
                {
                    paxType = "Children";
                }
                else if (pt.Contains("INFANT") || pt.Contains("BEBEK") || pt.Contains("INF"))
                {
                    paxType = "Infant";
                }
                else
                {
                    paxType = "Adult";
                }
                errorMessage = null;
                return true;
            }

            paxType = string.Empty;
            errorMessage = BothBlankErrorMessage;
            return false;
        }
    }
}
