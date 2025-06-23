using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NebulaChat.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class OptimizeDbSchemaComplete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Messages_ChatId_CreatedAt",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Messages_ReplyToMessageId",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Chats_LastMessageAt",
                table: "Chats");

            migrationBuilder.DropIndex(
                name: "IX_ChatParticipants_JoinedAt",
                table: "ChatParticipants");

            migrationBuilder.RenameIndex(
                name: "IX_Messages_AuthorId",
                table: "Messages",
                newName: "IX_Messages_Author");

            migrationBuilder.RenameIndex(
                name: "IX_ChatParticipants_UserId",
                table: "ChatParticipants",
                newName: "IX_ChatParticipants_User");

            migrationBuilder.RenameIndex(
                name: "IX_ChatParticipants_ChatId_UserId",
                table: "ChatParticipants",
                newName: "IX_ChatParticipants_Unique");

            migrationBuilder.AlterColumn<string>(
                name: "GoogleId",
                table: "Users",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "GitHubId",
                table: "Users",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "AvatarUrl",
                table: "Users",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "AppleId",
                table: "Users",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FileUrl",
                table: "Messages",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "Messages",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(4000)",
                oldMaxLength: 4000);

            migrationBuilder.AlterColumn<int>(
                name: "MaxParticipants",
                table: "Chats",
                type: "integer",
                nullable: true,
                defaultValue: 100,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Chats",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "AvatarUrl",
                table: "Chats",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_AppleId",
                table: "Users",
                column: "AppleId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_GitHubId",
                table: "Users",
                column: "GitHubId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_GoogleId",
                table: "Users",
                column: "GoogleId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_LastLoginAt",
                table: "Users",
                column: "LastLoginAt");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_Chat_CreatedAt",
                table: "Messages",
                columns: new[] { "ChatId", "CreatedAt" },
                descending: new[] { false, true });

            migrationBuilder.CreateIndex(
                name: "IX_Messages_Chat_Deleted",
                table: "Messages",
                columns: new[] { "ChatId", "IsDeleted" },
                filter: "\"IsDeleted\" = true");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_Chat_Edited",
                table: "Messages",
                columns: new[] { "ChatId", "IsEdited" },
                filter: "\"IsEdited\" = true");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_ReplyTo",
                table: "Messages",
                column: "ReplyToMessageId",
                filter: "\"ReplyToMessageId\" IS NOT NULL");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Message_FileSize",
                table: "Messages",
                sql: "\"FileSize\" IS NULL OR \"FileSize\" <= 52428800");

            migrationBuilder.CreateIndex(
                name: "IX_Chats_ActiveChats",
                table: "Chats",
                columns: new[] { "IsArchived", "LastMessageAt" },
                filter: "\"IsArchived\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_Chats_LastMessageAt",
                table: "Chats",
                column: "LastMessageAt",
                descending: new bool[0]);

            migrationBuilder.CreateIndex(
                name: "IX_Chats_Name_Search",
                table: "Chats",
                column: "Name");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Chat_MaxParticipants",
                table: "Chats",
                sql: "\"MaxParticipants\" > 0 AND \"MaxParticipants\" <= 10000");

            migrationBuilder.CreateIndex(
                name: "IX_ChatParticipants_Chat_Active",
                table: "ChatParticipants",
                columns: new[] { "ChatId", "IsBanned" },
                filter: "\"IsBanned\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_ChatParticipants_Chat_Joined",
                table: "ChatParticipants",
                columns: new[] { "ChatId", "JoinedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_ChatParticipants_Notifications",
                table: "ChatParticipants",
                columns: new[] { "UserId", "NotificationsEnabled" },
                filter: "\"NotificationsEnabled\" = true");

            migrationBuilder.CreateIndex(
                name: "IX_ChatParticipants_UnreadMessages",
                table: "ChatParticipants",
                columns: new[] { "UserId", "LastReadMessageId", "ChatId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_AppleId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_GitHubId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_GoogleId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_LastLoginAt",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Messages_Chat_CreatedAt",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Messages_Chat_Deleted",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Messages_Chat_Edited",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Messages_ReplyTo",
                table: "Messages");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Message_FileSize",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Chats_ActiveChats",
                table: "Chats");

            migrationBuilder.DropIndex(
                name: "IX_Chats_LastMessageAt",
                table: "Chats");

            migrationBuilder.DropIndex(
                name: "IX_Chats_Name_Search",
                table: "Chats");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Chat_MaxParticipants",
                table: "Chats");

            migrationBuilder.DropIndex(
                name: "IX_ChatParticipants_Chat_Active",
                table: "ChatParticipants");

            migrationBuilder.DropIndex(
                name: "IX_ChatParticipants_Chat_Joined",
                table: "ChatParticipants");

            migrationBuilder.DropIndex(
                name: "IX_ChatParticipants_Notifications",
                table: "ChatParticipants");

            migrationBuilder.DropIndex(
                name: "IX_ChatParticipants_UnreadMessages",
                table: "ChatParticipants");

            migrationBuilder.RenameIndex(
                name: "IX_Messages_Author",
                table: "Messages",
                newName: "IX_Messages_AuthorId");

            migrationBuilder.RenameIndex(
                name: "IX_ChatParticipants_User",
                table: "ChatParticipants",
                newName: "IX_ChatParticipants_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_ChatParticipants_Unique",
                table: "ChatParticipants",
                newName: "IX_ChatParticipants_ChatId_UserId");

            migrationBuilder.AlterColumn<string>(
                name: "GoogleId",
                table: "Users",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "GitHubId",
                table: "Users",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "AvatarUrl",
                table: "Users",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "AppleId",
                table: "Users",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FileUrl",
                table: "Messages",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "Messages",
                type: "character varying(4000)",
                maxLength: 4000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(2000)",
                oldMaxLength: 2000);

            migrationBuilder.AlterColumn<int>(
                name: "MaxParticipants",
                table: "Chats",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true,
                oldDefaultValue: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Chats",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(1000)",
                oldMaxLength: 1000,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "AvatarUrl",
                table: "Chats",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Messages_ChatId_CreatedAt",
                table: "Messages",
                columns: new[] { "ChatId", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_Messages_ReplyToMessageId",
                table: "Messages",
                column: "ReplyToMessageId");

            migrationBuilder.CreateIndex(
                name: "IX_Chats_LastMessageAt",
                table: "Chats",
                column: "LastMessageAt");

            migrationBuilder.CreateIndex(
                name: "IX_ChatParticipants_JoinedAt",
                table: "ChatParticipants",
                column: "JoinedAt");
        }
    }
}
