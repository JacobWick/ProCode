using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AfdsfddUserCoursefds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_userCourses",
                table: "userCourses");

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "userCourses",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_userCourses",
                table: "userCourses",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_userCourses_UserId",
                table: "userCourses",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_userCourses",
                table: "userCourses");

            migrationBuilder.DropIndex(
                name: "IX_userCourses_UserId",
                table: "userCourses");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "userCourses");

            migrationBuilder.AddPrimaryKey(
                name: "PK_userCourses",
                table: "userCourses",
                columns: new[] { "UserId", "CourseId" });
        }
    }
}
