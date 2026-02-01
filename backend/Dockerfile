# ----------------------
# Stage 1: Build
# ----------------------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj(s) and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy the rest of the code and publish
COPY . ./
RUN dotnet publish -c Release -o /app

# ----------------------
# Stage 2: Runtime
# ----------------------
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

# Copy published app from build stage
COPY --from=build /app .

# Start the application
ENTRYPOINT ["dotnet", "backend.dll"]
