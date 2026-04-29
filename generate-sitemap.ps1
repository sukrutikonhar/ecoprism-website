# PowerShell Script to Auto-Generate sitemap.xml
# This script scans the website directory and generates a sitemap.xml file
# Usage: .\generate-sitemap.ps1

$ErrorActionPreference = "Stop"

# Configuration
$baseUrl = "https://ecoprism.com"
$rootDir = $PSScriptRoot
$sitemapPath = Join-Path $rootDir "sitemap.xml"

# Directories to exclude from sitemap
$excludeDirs = @(
    "v3",
    "vendor",
    "docs",
    "test",
    "cdn-cgi",
    "assets",
    "node_modules",
    ".git",
    "cache",
    "tmp",
    "temp",
    "brochure"
)

# Files to exclude
$excludeFiles = @(
    "header.html",
    "footer.html",
    "blog-footer.html",
    "Default.html",
    "error_log",
    "test.html",
    "failure.html",
    "success.html",
    "cancel.html"
)

# File patterns to exclude (partial matches)
$excludePatterns = @(
    "test",
    "failure",
    "success",
    "cancel"
)

# URLs/paths to exclude from sitemap (exact or pattern matches)
$excludeUrls = @(
    "/microsoft-partners/index2",
    "/resources/case-studies/tailored-training-global-air-filter-manufacturer/case-studies",
    "/resources/case-studies/tailored-training-global-air-filter-manufacturer/",
    "/resources/case-studies/esg-transformation/",
    "/resources/case-studies/streamlining-decommissioning-end-life-processes/",
    "/careers/esg-solutions-specialist",
    "/careers/esg-trainee",
    "/careers/senior-esg-solutions-specialist"
)

# Priority mapping based on URL patterns
function Get-Priority {
    param([string]$url)
    
    # Homepage
    if ($url -eq $baseUrl -or $url -eq "$baseUrl/") {
        return "1.00"
    }
    
    # Main navigation pages (root level)
    $mainPages = @("about-us", "contact-us", "our-team", "privacy-policy", "esg-platform", "ecoquote", "esg-benchmarking", "ecobot", "csrd-reporting")
    foreach ($page in $mainPages) {
        if ($url -match "/$page$" -or $url -match "/$page/$") {
            return "0.80"
        }
    }
    
    # Services
    if ($url -match "/services/") {
        return "0.80"
    }
    
    # Directory index pages (insights, whitepapers, events, careers)
    if ($url -match "/(resources/insights|resources/whitepapers|news/events|careers)/$") {
        return "0.80"
    }
    
    # Case studies (keep trailing slash)
    if ($url -match "/resources/case-studies/") {
        return "0.80"
    }
    
    # Blog posts / Insights
    if ($url -match "/resources/insights/") {
        return "0.70"
    }
    
    # Whitepapers
    if ($url -match "/resources/whitepapers/") {
        return "0.70"
    }
    
    # News articles
    if ($url -match "/news/(company-news|news-media|ecoprism-|meeting-|gartner-|redefining-|reuters-)") {
        return "0.70"
    }
    
    # Events
    if ($url -match "/events/") {
        return "0.70"
    }
    
    # Career pages
    if ($url -match "/careers/") {
        return "0.64"
    }
    
    # Resources (general)
    if ($url -match "/resources/") {
        return "0.70"
    }
    
    # Default priority
    return "0.64"
}

# Function to convert file path to URL
function Convert-PathToUrl {
    param(
        [string]$filePath,
        [string]$root
    )
    
    # Get relative path from root
    $relativePath = $filePath.Replace($root, "").Replace("\", "/")
    
    # Remove leading slash if present
    if ($relativePath.StartsWith("/")) {
        $relativePath = $relativePath.Substring(1)
    }
    
    # Remove .html extension
    if ($relativePath -match "\.html$") {
        $relativePath = $relativePath -replace "\.html$", ""
    }
    
    # Handle index.html files
    if ($relativePath -match "index$") {
        $relativePath = $relativePath -replace "/index$", "/"
    }
    
    # Build URL
    if ($relativePath -eq "" -or $relativePath -eq "index") {
        return $baseUrl
    }
    
    # Add trailing slash for directory indexes (insights, whitepapers, events, careers, case-studies)
    if ($relativePath -match "^(resources/insights|resources/whitepapers|news/events|careers|resources/case-studies|csrd-reporting|microsoft-partners)$") {
        return "$baseUrl/$relativePath/"
    }
    
    return "$baseUrl/$relativePath"
}

# Function to format date for sitemap (ISO 8601)
function Format-LastMod {
    param([System.IO.FileInfo]$file)
    
    $lastWrite = $file.LastWriteTimeUtc
    return $lastWrite.ToString("yyyy-MM-ddTHH:mm:ss+00:00")
}

# Function to escape XML special characters in URLs
function Escape-XmlString {
    param([string]$str)
    
    # Escape XML special characters
    $str = $str -replace '&', '&amp;'   # Must be first!
    $str = $str -replace '<', '&lt;'
    $str = $str -replace '>', '&gt;'
    $str = $str -replace '"', '&quot;'
    $str = $str -replace "'", '&apos;'
    
    return $str
}

# Get all HTML files
Write-Host "Scanning for HTML files..." -ForegroundColor Cyan

$htmlFiles = Get-ChildItem -Path $rootDir -Filter "*.html" -Recurse | Where-Object {
    $file = $_
    $relativePath = $file.FullName.Replace($rootDir, "").Replace("\", "/")
    
    # Check if file is in excluded directory
    $inExcludedDir = $false
    foreach ($exDir in $excludeDirs) {
        if ($relativePath -match "/$exDir/") {
            $inExcludedDir = $true
            break
        }
    }
    
    if ($inExcludedDir) {
        return $false
    }
    
    # Check if file is in exclude list
    $fileName = Split-Path -Leaf $file.Name
    if ($excludeFiles -contains $fileName) {
        return $false
    }
    
    # Check if file matches exclude patterns
    foreach ($pattern in $excludePatterns) {
        if ($fileName -match $pattern -and $fileName -ne "index.html") {
            return $false
        }
    }
    
    return $true
}

Write-Host "Found $($htmlFiles.Count) HTML files to process" -ForegroundColor Green

# Generate sitemap entries
$entries = @()
$seenUrls = @{}  # Track URLs to prevent duplicates

foreach ($file in $htmlFiles) {
    $url = Convert-PathToUrl -filePath $file.FullName -root $rootDir
    
    # Skip excluded URLs
    $shouldExclude = $false
    foreach ($excludeUrl in $excludeUrls) {
        if ($url -match [regex]::Escape($excludeUrl) -or $url -eq "$baseUrl$excludeUrl") {
            Write-Host "Excluding URL: $url" -ForegroundColor Yellow
            $shouldExclude = $true
            break
        }
    }
    
    if ($shouldExclude) {
        continue
    }
    
    # Normalize URL for duplicate detection (remove trailing slash for comparison)
    $normalizedUrl = $url.TrimEnd('/')
    if ($url -eq $baseUrl -or $url -eq "$baseUrl/") {
        $normalizedUrl = $baseUrl
    }
    
    # Skip duplicate URLs (keep the first one found)
    if ($seenUrls.ContainsKey($normalizedUrl)) {
        Write-Host "Skipping duplicate URL: $url" -ForegroundColor Yellow
        continue
    }
    $seenUrls[$normalizedUrl] = $true
    
    $priority = Get-Priority -url $url
    $lastmod = Format-LastMod -file $file
    
    $entries += [PSCustomObject]@{
        Url = $url
        LastMod = $lastmod
        Priority = $priority
        FilePath = $file.FullName
    }
}

# Sort entries: homepage first, then by URL
$sortedEntries = $entries | Sort-Object {
    if ($_.Url -eq $baseUrl -or $_.Url -eq "$baseUrl/") {
        return "0"
    }
    return $_.Url
}

# Generate XML
Write-Host "Generating sitemap.xml..." -ForegroundColor Cyan

$xml = @"
<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<!-- Auto-generated sitemap - Generated on $(Get-Date -Format "yyyy-MM-dd HH:mm:ss") -->

"@

foreach ($entry in $sortedEntries) {
    # Escape XML special characters in URL
    $escapedUrl = Escape-XmlString -str $entry.Url
    
    $xml += @"
<url>
  <loc>$escapedUrl</loc>
  <lastmod>$($entry.LastMod)</lastmod>
  <priority>$($entry.Priority)</priority>
</url>

"@
}

$xml += @"

</urlset>
"@

# Write to file
try {
    # Backup existing sitemap
    if (Test-Path $sitemapPath) {
        $backupPath = "$sitemapPath.backup"
        Copy-Item $sitemapPath $backupPath -Force
        Write-Host "Backed up existing sitemap to: $backupPath" -ForegroundColor Yellow
    }
    
    # Write new sitemap
    [System.IO.File]::WriteAllText($sitemapPath, $xml, [System.Text.Encoding]::UTF8)
    
    Write-Host ""
    Write-Host "Sitemap generated successfully!" -ForegroundColor Green
    Write-Host "  Location: $sitemapPath" -ForegroundColor White
    Write-Host "  Total URLs: $($sortedEntries.Count)" -ForegroundColor White
    Write-Host ""
    Write-Host "Preview of first 10 URLs:" -ForegroundColor Cyan
    $sortedEntries | Select-Object -First 10 | ForEach-Object {
        Write-Host "  - $($_.Url) (Priority: $($_.Priority))" -ForegroundColor Gray
    }
    Write-Host ""
}
catch {
    Write-Host "Error generating sitemap: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
