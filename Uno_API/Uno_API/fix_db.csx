using System;
using Microsoft.Data.SqlClient;

string connectionString = "Server=DIGITELLIGENCE\\DIGITELLIGENCE;Database=UnoErpDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True";

using (var connection = new SqlConnection(connectionString))
{
    connection.Open();
    using (var command = new SqlCommand("UPDATE Hotels SET Email = Phone, Phone = '-' WHERE Phone LIKE '%@%' AND (Email = '' OR Email = '-' OR Email IS NULL)", connection))
    {
        int rowsAffected = command.ExecuteNonQuery();
        Console.WriteLine($"Rows affected: {rowsAffected}");
    }
}
