# Update HTML files to use ES Module entry point
$htmlFiles = @(
    "index.html",
    "kalender.html",
    "tracker.html",
    "jadwal-shalat.html",
    "panduan.html",
    "pengaturan.html"
)

foreach ($file in $htmlFiles) {
    $filePath = "d:\WebstormProject\puasa-ayyamul-bidh\$file"
    $content = Get-Content $filePath -Raw
    
    # Pattern to match the old script tags (6 lines)
    $oldPattern = '    <!-- App JS Modules -->\r\n    <script src="js/storage.js"></script>\r\n    <script src="js/utils.js"></script>\r\n    <script src="js/prayer-times.js"></script>\r\n    <script src="js/hijri-calendar.js"></script>\r\n    <script src="js/tracker.js"></script>\r\n    <script src="js/app.js"></script>'
    
    # New module entry point
    $newPattern = '    <!-- JavaScript Modules -->\r\n    <script type="module" src="/js/main.js"></script>'
    
    # Replace
    $content = $content -replace [regex]::Escape($oldPattern), $newPattern
    
    # Write back
    Set-Content $filePath $content -NoNewline
    
    Write-Host "✅ Updated $file"
}

Write-Host "`n🎉 All 6 HTML files updated successfully!"
