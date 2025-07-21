# Elastic Beanstalk Update Script with AWS CLI Integration
# Run this whenever you make changes to your project

Write-Host "Starting EB Update Process..." -ForegroundColor Green

# Step 1: Build the project
Write-Host "Building project..." -ForegroundColor Yellow
& "C:\Program Files\nodejs\node.exe" ".\node_modules\webpack\bin\webpack.js" --mode production

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build completed successfully!" -ForegroundColor Green
} else {
    Write-Host "Build failed! Please fix errors and try again." -ForegroundColor Red
    exit 1
}

# Step 2: Create deployment package
Write-Host "Creating deployment package..." -ForegroundColor Yellow

# Remove existing zip if it exists
if (Test-Path "deployment.zip") {
    Remove-Item "deployment.zip" -Force
    Write-Host "Removed existing deployment.zip" -ForegroundColor Yellow
}

# Create new deployment package
$deploymentFiles = @(
    "dist",
    "server.js", 
    "package.json",
    "package-lock.json",
    "Dockerfile",
    ".dockerignore"
)

Compress-Archive -Path $deploymentFiles -DestinationPath "deployment.zip" -Force

if (Test-Path "deployment.zip") {
    $fileSize = [math]::Round((Get-Item 'deployment.zip').Length / 1MB, 2)
    Write-Host "Deployment package created: deployment.zip ($fileSize MB)" -ForegroundColor Green
    
    # Step 3: Check if AWS CLI is available
    Write-Host "Checking AWS CLI..." -ForegroundColor Yellow
    $awsCli = Get-Command aws -ErrorAction SilentlyContinue
    
    if ($awsCli) {
        Write-Host "AWS CLI found. Attempting automatic deployment..." -ForegroundColor Green
        
        # Load configuration from file
        $configPath = "eb-config.json"
        if (Test-Path $configPath) {
            $config = Get-Content $configPath | ConvertFrom-Json
            $appName = $config.applicationName
            $envName = $config.environmentName
            $region = $config.region
            $s3Bucket = $config.s3Bucket
            
            Write-Host "Loaded configuration from eb-config.json" -ForegroundColor Green
        } else {
            Write-Host "Configuration file not found. Please run setup-eb-config.ps1 first." -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Manual Deployment Steps:" -ForegroundColor Cyan
            Write-Host "1. Go to AWS Console > Elastic Beanstalk" -ForegroundColor White
            Write-Host "2. Select your application environment" -ForegroundColor White
            Write-Host "3. Click 'Upload and Deploy'" -ForegroundColor White
            Write-Host "4. Upload the deployment.zip file" -ForegroundColor White
            Write-Host "5. Wait for deployment to complete (5-10 minutes)" -ForegroundColor White
            Write-Host ""
            Write-Host "Your updated app will be available at your EB URL" -ForegroundColor Green
            return
        }
        
        if ($appName -and $envName -and $region) {
            Write-Host "Deploying to AWS Elastic Beanstalk..." -ForegroundColor Green
            
            try {
                # Create application version
                Write-Host "Creating application version..." -ForegroundColor Yellow
                $versionLabel = "v$(Get-Date -Format 'yyyyMMdd-HHmmss')"
                
                $createVersionCmd = "aws elasticbeanstalk create-application-version --application-name '$appName' --version-label '$versionLabel' --source-bundle S3Bucket='$s3Bucket',S3Key='deployment.zip' --region '$region'"
                
                # First, upload to S3 (if bucket doesn't exist, create it)
                Write-Host "Uploading to S3..." -ForegroundColor Yellow
                $s3UploadCmd = "aws s3 cp deployment.zip s3://$s3Bucket/ --region $region"
                
                # Create S3 bucket if it doesn't exist
                $bucketExists = aws s3 ls "s3://$s3Bucket" --region $region 2>$null
                if (-not $bucketExists) {
                    Write-Host "Creating S3 bucket for deployments..." -ForegroundColor Yellow
                    aws s3 mb "s3://$s3Bucket" --region $region
                }
                
                # Upload to S3
                Invoke-Expression $s3UploadCmd
                
                # Create application version
                Invoke-Expression $createVersionCmd
                
                # Deploy to environment
                Write-Host "Deploying to environment..." -ForegroundColor Yellow
                $deployCmd = "aws elasticbeanstalk update-environment --environment-name '$envName' --version-label '$versionLabel' --region '$region'"
                Invoke-Expression $deployCmd
                
                Write-Host "Deployment initiated successfully!" -ForegroundColor Green
                Write-Host "Version Label: $versionLabel" -ForegroundColor Cyan
                Write-Host "Check your EB Console for deployment status..." -ForegroundColor Yellow
                Write-Host "Your app will be available at your EB URL once deployment completes." -ForegroundColor Green
                
            } catch {
                Write-Host "AWS CLI deployment failed. Please deploy manually:" -ForegroundColor Red
                Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
                Write-Host ""
                Write-Host "Manual Deployment Steps:" -ForegroundColor Cyan
                Write-Host "1. Go to AWS Console > Elastic Beanstalk" -ForegroundColor White
                Write-Host "2. Select your application environment" -ForegroundColor White
                Write-Host "3. Click 'Upload and Deploy'" -ForegroundColor White
                Write-Host "4. Upload the deployment.zip file" -ForegroundColor White
                Write-Host "5. Wait for deployment to complete (5-10 minutes)" -ForegroundColor White
                Write-Host ""
                Write-Host "Your updated app will be available at your EB URL" -ForegroundColor Green
            }
        } else {
            Write-Host "Missing required information. Please deploy manually:" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Manual Deployment Steps:" -ForegroundColor Cyan
            Write-Host "1. Go to AWS Console > Elastic Beanstalk" -ForegroundColor White
            Write-Host "2. Select your application environment" -ForegroundColor White
            Write-Host "3. Click 'Upload and Deploy'" -ForegroundColor White
            Write-Host "4. Upload the deployment.zip file" -ForegroundColor White
            Write-Host "5. Wait for deployment to complete (5-10 minutes)" -ForegroundColor White
            Write-Host ""
            Write-Host "Your updated app will be available at your EB URL" -ForegroundColor Green
        }
    } else {
        Write-Host "AWS CLI not found. Please install AWS CLI or deploy manually:" -ForegroundColor Yellow
        Write-Host "Download AWS CLI from: https://aws.amazon.com/cli/" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Manual Deployment Steps:" -ForegroundColor Cyan
        Write-Host "1. Go to AWS Console > Elastic Beanstalk" -ForegroundColor White
        Write-Host "2. Select your application environment" -ForegroundColor White
        Write-Host "3. Click 'Upload and Deploy'" -ForegroundColor White
        Write-Host "4. Upload the deployment.zip file" -ForegroundColor White
        Write-Host "5. Wait for deployment to complete (5-10 minutes)" -ForegroundColor White
        Write-Host ""
        Write-Host "Your updated app will be available at your EB URL" -ForegroundColor Green
    }
} else {
    Write-Host "Failed to create deployment package" -ForegroundColor Red
} 