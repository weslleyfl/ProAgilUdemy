using Microsoft.EntityFrameworkCore;
using ProAgil.API.Model;

namespace ProAgil.API.Data 
{
    public class DataContext : DbContext 
    {

        public DbSet<Evento> Eventos { get; set; }

        public DataContext (DbContextOptions<DataContext> options) : base (options) 
        {

        }
    }
}