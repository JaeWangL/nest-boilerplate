IF EXISTS (SELECT name
FROM sys.schemas
WHERE name = N'main3')
	BEGIN
    DROP SCHEMA [main3]
END


GO
CREATE SCHEMA [main3] AUTHORIZATION [dbo]


GO
CREATE TABLE [main3].[Users]
(
    [Id] BIGINT IDENTITY (1, 1) NOT NULL,
    [Email] NVARCHAR (256) NULL,
    [PasswordHash] NVARCHAR (MAX) NULL,
    [EmailConfirmed] BIT NOT NULL,
    [CreatedAt] DATETIMEOFFSET (7) DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIMEOFFSET (7) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC)
);

CREATE TABLE [main3].[Tokens]
(
    [Id] BIGINT IDENTITY (1, 1) NOT NULL,
    [UserId] BIGINT NOT NULL,
    [RefreshToken] NVARCHAR (1024) NULL,
    [ExpirationDate] DATETIMEOFFSET (7) NOT NULL,
    [CreatedAt] DATETIMEOFFSET (7) DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIMEOFFSET (7) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK_Tokens] PRIMARY KEY CLUSTERED ([Id] ASC)
);
