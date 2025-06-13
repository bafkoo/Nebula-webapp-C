# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj files and restore dependencies
COPY *.sln ./
COPY NebulaChat.Domain/*.csproj ./NebulaChat.Domain/
COPY NebulaChat.Application/*.csproj ./NebulaChat.Application/
COPY NebulaChat.Infrastructure/*.csproj ./NebulaChat.Infrastructure/
COPY NebulaChat.API/*.csproj ./NebulaChat.API/

RUN dotnet restore

# Copy source code
COPY . .

# Build the application
RUN dotnet publish NebulaChat.API/NebulaChat.API.csproj -c Release -o out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy published app
COPY --from=build /app/out .

# Expose port
EXPOSE 8080

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Start the application
ENTRYPOINT ["dotnet", "NebulaChat.API.dll"] 