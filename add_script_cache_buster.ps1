# Add cache busters to script.js references in all insight pages
$rootPath = "C:\Users\inno\Desktop\eco11122025"
$fixedCount = 0

Write-Host "Adding cache busters to script.js references..." -ForegroundColor Yellow

$insightFiles = Get-ChildItem "$rootPath\resources\insights\*.html" | Where-Object { $_.Name -ne "index.html" }

foreach ($file in $insightFiles) {
    $content = [IO.File]::ReadAllText($file.FullName, [Text.Encoding]::UTF8)
    $originalContent = $content
    
    # Add cache buster to script.js if it doesn't have one
    # Pattern: src="../../assets/js/script.js" -> src="../../assets/js/script.js?v=20250105"
    if ($content -match 'src="\.\.\/\.\.\/assets\/js\/script\.js"(?!\?)') {
        # Generate cache buster with current date
        $cacheVersion = (Get-Date).ToString("yyyyMMdd")
        $content = $content -replace 'src="(\.\.\/\.\.\/assets\/js\/script\.js)"', "src=`$1?v=$cacheVersion"
        
        [IO.File]::WriteAllText($file.FullName, $content, [Text.Encoding]::UTF8)
        $fixedCount++
        Write-Host "  Fixed: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`nFixed script.js cache busters in $fixedCount insight pages" -ForegroundColor Green
