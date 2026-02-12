# ----------------------
# Stage 1: Build
# ----------------------
FROM mcr.microsoft.com/dotnet/sdk:9.0-alpine AS build
WORKDIR /src

# Copy csproj(s) first for layer caching
COPY *.csproj ./

# Restore dependencies (cached unless csproj changes)
RUN dotnet restore --disable-parallel --runtime linux-musl-x64

# Copy the rest of the code
COPY . ./

# Publish with trimming for smaller size
RUN dotnet publish \
    -c Release \
    -o /app \
    --runtime linux-musl-x64 \
    --self-contained false \
    --no-restore \
    /p:PublishTrimmed=false \
    /p:TrimMode=partial

# ----------------------
# Stage 2: Runtime (Alpine = smaller & faster)
# ----------------------
FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine AS runtime

# Install ICU libraries for globalization (required by .NET)
RUN apk add --no-cache icu-libs

WORKDIR /app

# Copy published app from build stage
COPY --from=build /app .

# Set environment variables
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=0
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080

EXPOSE 8080

# Start the application
ENTRYPOINT ["dotnet", "backend.dll"]
