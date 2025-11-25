using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUserInterests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TagUser",
                columns: table => new
                {
                    InterestedUsersId = table.Column<Guid>(type: "uuid", nullable: false),
                    TagsIntrestedInId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TagUser", x => new { x.InterestedUsersId, x.TagsIntrestedInId });
                    table.ForeignKey(
                        name: "FK_TagUser_AspNetUsers_InterestedUsersId",
                        column: x => x.InterestedUsersId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TagUser_Tags_TagsIntrestedInId",
                        column: x => x.TagsIntrestedInId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TagUser_TagsIntrestedInId",
                table: "TagUser",
                column: "TagsIntrestedInId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TagUser");
        }
    }
}
