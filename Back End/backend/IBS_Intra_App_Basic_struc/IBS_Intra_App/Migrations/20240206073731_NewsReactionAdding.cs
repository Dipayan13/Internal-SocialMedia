using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IBS_Intra_App.Migrations
{
    public partial class NewsReactionAdding : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "NewsActivity",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    E_Id = table.Column<string>(type: "TEXT", nullable: false),
                    N_Id = table.Column<string>(type: "TEXT", nullable: false),
                    Reaction = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NewsActivity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NewsActivity_AspNetUsers_E_Id",
                        column: x => x.E_Id,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NewsActivity_News_N_Id",
                        column: x => x.N_Id,
                        principalTable: "News",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_NewsActivity_E_Id",
                table: "NewsActivity",
                column: "E_Id");

            migrationBuilder.CreateIndex(
                name: "IX_NewsActivity_N_Id",
                table: "NewsActivity",
                column: "N_Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NewsActivity");
        }
    }
}
