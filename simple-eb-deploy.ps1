# Simple EB Deployment Script
# Creates a minimal deployment package that EB can handle

Write-Host "Creating simple EB deployment package..." -ForegroundColor Green

# Step 1: Build the project
Write-Host "Building project..." -ForegroundColor Yellow
& "C:\Program Files\nodejs\node.exe" ".\node_modules\webpack\bin\webpack.js" --mode production

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build completed successfully!" -ForegroundColor Green
} else {
    Write-Host "Build failed! Please fix errors and try again." -ForegroundColor Red
    exit 1
}

# Step 2: Create a completely clean deployment directory
Write-Host "Creating clean deployment structure..." -ForegroundColor Yellow
$deployDir = "eb-deploy"
if (Test-Path $deployDir) {
    Remove-Item $deployDir -Recurse -Force
}
New-Item -ItemType Directory -Path $deployDir | Out-Null

# Step 3: Copy only essential files with proper structure
Write-Host "Copying essential files..." -ForegroundColor Yellow

# Copy built files to root of deployment
Copy-Item -Path "dist\*" -Destination "$deployDir\" -Force

# Copy server files
Copy-Item -Path "server.js" -Destination "$deployDir\server.js" -Force
Copy-Item -Path "package.json" -Destination "$deployDir\package.json" -Force
Copy-Item -Path "package-lock.json" -Destination "$deployDir\package-lock.json" -Force

# Copy EB configuration
if (Test-Path ".ebextensions") {
    Copy-Item -Path ".ebextensions" -Destination "$deployDir\.ebextensions" -Recurse -Force
}

# Step 4: Create a simple Dockerfile for EB
$dockerfileContent = @"
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
"@

$dockerfileContent | Out-File -FilePath "$deployDir\Dockerfile" -Encoding UTF8

# Step 5: Create deployment package
Write-Host "Creating deployment package..." -ForegroundColor Yellow

# Remove existing zip
if (Test-Path "deployment.zip") {
    Remove-Item "deployment.zip" -Force
    Write-Host "Removed existing deployment.zip" -ForegroundColor Yellow
}

# Create zip from the clean directory
try {
    # Change to deployment directory and create zip from there
    Push-Location $deployDir
    
    # Create zip with all contents
    Compress-Archive -Path "*" -DestinationPath "..\deployment.zip" -Force
    
    Pop-Location
    
    if (Test-Path "deployment.zip") {
        $fileSize = [math]::Round((Get-Item 'deployment.zip').Length / 1MB, 2)
        Write-Host "Deployment package created: deployment.zip ($fileSize MB)" -ForegroundColor Green
        
        # Verify contents
        Write-Host "`nPackage contents:" -ForegroundColor Cyan
        $tempExtract = "temp-verify"
        if (Test-Path $tempExtract) {
            Remove-Item $tempExtract -Recurse -Force
        }
        Expand-Archive -Path "deployment.zip" -DestinationPath $tempExtract -Force
        Get-ChildItem $tempExtract -Recurse | ForEach-Object {
            Write-Host "  $($_.Name)" -ForegroundColor White
        }
        Remove-Item $tempExtract -Recurse -Force
        
        Write-Host "`n✅ Simple deployment package ready!" -ForegroundColor Green
        Write-Host "✅ No complex folder structures" -ForegroundColor Green
        Write-Host "✅ EB-compatible file layout" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next Steps:" -ForegroundColor Cyan
        Write-Host "1. Go to AWS Console > Elastic Beanstalk" -ForegroundColor White
        Write-Host "2. Select your application environment" -ForegroundColor White
        Write-Host "3. Click 'Upload and Deploy'" -ForegroundColor White
        Write-Host "4. Upload the deployment.zip file" -ForegroundColor White
        Write-Host "5. Wait for deployment to complete" -ForegroundColor White
    } else {
        Write-Host "Failed to create deployment package" -ForegroundColor Red
    }
} catch {
    Write-Host "Error creating deployment package: $($_.Exception.Message)" -ForegroundColor Red
}

# Cleanup
Remove-Item $deployDir -Recurse -Force 