using System;
using Microsoft.Data.SqlClient;

class Program
{
    static void Main()
    {
        string connectionString = "Server=DIGITELLIGENCE\\DIGITELLIGENCE;Database=UnoErpDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True";
        
        string sql = @"
            BEGIN TRANSACTION;
            
            IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'GuideId' AND Object_ID = Object_ID(N'Tours'))
            BEGIN
                ALTER TABLE [Tours] ADD [GuideId] int NULL;
                CREATE INDEX [IX_Tours_GuideId] ON [Tours] ([GuideId]);
                ALTER TABLE [Tours] ADD CONSTRAINT [FK_Tours_Guides_GuideId] FOREIGN KEY ([GuideId]) REFERENCES [Guides] ([Id]) ON DELETE NO ACTION;
            END

            COMMIT;
        ";

        using (SqlConnection connection = new SqlConnection(connectionString))
        {
            SqlCommand command = new SqlCommand(sql, connection);
            connection.Open();
            command.ExecuteNonQuery();
            Console.WriteLine("Added GuideId to Tours table.");
        }
    }
}
