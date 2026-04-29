# Generate explicit redirect rules for all URLs that were changed from / to no /
$rootPath = "C:\Users\inno\Desktop\eco11122025"
$redirects = @()

Write-Host "Generating redirect rules for URLs changed from / to no /..." -ForegroundColor Yellow

# Process insight articles
$insightFiles = Get-ChildItem "$rootPath\resources\insights\*.html" | Where-Object { $_.Name -ne "index.html" }
foreach ($file in $insightFiles) {
    $fileName = $file.BaseName
    $redirects += "Redirect 301 /resources/insights/$fileName/ https://ecoprism.com/resources/insights/$fileName"
}

# Process whitepapers
$whitepaperFiles = Get-ChildItem "$rootPath\resources\whitepapers\*.html" | Where-Object { $_.Name -ne "index.html" }
foreach ($file in $whitepaperFiles) {
    $fileName = $file.BaseName
    $redirects += "Redirect 301 /resources/whitepapers/$fileName/ https://ecoprism.com/resources/whitepapers/$fileName"
}

# Process news articles
$newsFiles = Get-ChildItem "$rootPath\news\*.html" -Recurse | Where-Object { $_.Name -ne "index.html" }
foreach ($file in $newsFiles) {
    $relativePath = $file.FullName.Replace($rootPath, "").Replace("\", "/").TrimStart("/").Replace(".html", "")
    $relativePath = $relativePath -replace '^news/', '/news/'
    if ($relativePath -notmatch '^/events/') {
        $redirects += "Redirect 301 $relativePath/ https://ecoprism.com$relativePath"
    }
}

# Process news events
$eventFiles = Get-ChildItem "$rootPath\news\events\*.html" | Where-Object { $_.Name -ne "index.html" }
foreach ($file in $eventFiles) {
    $fileName = $file.BaseName
    $redirects += "Redirect 301 /events/$fileName/ https://ecoprism.com/events/$fileName"
}

# Process resource pages
$resourcePages = @("esrs-adoption", "maturity-assessment", "california-climate-laws-explained", "csrd-adoption", "glossary", "brsr-reporting")
foreach ($page in $resourcePages) {
    if (Test-Path "$rootPath\resources\$page.html") {
        $redirects += "Redirect 301 /resources/$page/ https://ecoprism.com/resources/$page"
    }
}

# Process product pages
$productPages = @("esg-platform", "ecoquote", "esg-benchmarking", "ecobot", "ecoprismxgartner")
foreach ($page in $productPages) {
    if (Test-Path "$rootPath\$page.html") {
        $redirects += "Redirect 301 /$page/ https://ecoprism.com/$page"
    }
}

# Process service pages
$serviceFiles = Get-ChildItem "$rootPath\services\*.html" | Where-Object { $_.Name -ne "index.html" }
foreach ($file in $serviceFiles) {
    $fileName = $file.BaseName
    $redirects += "Redirect 301 /services/$fileName/ https://ecoprism.com/services/$fileName"
}

# Process career pages
$careerFiles = Get-ChildItem "$rootPath\careers\*.html" | Where-Object { $_.Name -ne "index.html" }
foreach ($file in $careerFiles) {
    $fileName = $file.BaseName
    $redirects += "Redirect 301 /careers/$fileName/ https://ecoprism.com/careers/$fileName"
}

# Process other pages
$otherPages = @("privacy-policy", "about-us")
foreach ($page in $otherPages) {
    if (Test-Path "$rootPath\$page.html") {
        $redirects += "Redirect 301 /$page/ https://ecoprism.com/$page"
    }
}

# Output redirects
$redirects | ForEach-Object { Write-Host $_ -ForegroundColor Cyan }

# Save to file
$redirectsContent = $redirects -join "`n"
Set-Content -Path "$rootPath\redirects_to_add.txt" -Value $redirectsContent
Write-Host "`nGenerated $($redirects.Count) redirect rules and saved to redirects_to_add.txt" -ForegroundColor Green
