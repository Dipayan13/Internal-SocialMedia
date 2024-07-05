using IBS_Intra_App.DAL.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace IBS_Intra_App.DAL.Context
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public DbSet<Event> Events { get; set; }
        public DbSet<News> News { get; set; }
        public DbSet<EventDetail> EventDetails { get; set; }

        public DbSet<NewsActivity> NewsActivity { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
            // Disable lazy loading, so that linked foreign key details are not shown
            ChangeTracker.LazyLoadingEnabled = false;
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasIndex(e => e.Eid)
                .IsUnique();
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasMany<News>()
                .WithOne(n => n.User)
                .HasForeignKey(n => n.E_Id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasMany<Event>()
                .WithOne(n => n.User)
                .HasForeignKey(n => n.E_Id)
                .OnDelete(DeleteBehavior.Cascade);


            // Add any custom configurations or relationships here if needed.
        }
    }
}
