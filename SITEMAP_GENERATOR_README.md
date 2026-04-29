# Sitemap Generator Script

## Overview

The `generate-sitemap.ps1` script automatically generates a `sitemap.xml` file for your website by scanning all HTML files in the project directory.

## Usage

Simply run the script from the project root directory:

```powershell
.\generate-sitemap.ps1
```

## What It Does

1. **Scans** all `.html` files in the project
2. **Excludes** system directories (`v3`, `vendor`, `docs`, `test`, `assets`, etc.)
3. **Excludes** utility files (`header.html`, `footer.html`, `test.html`, etc.)
4. **Converts** file paths to clean URLs (removes `.html` extension)
5. **Sets** appropriate priorities based on page type:
   - Homepage: `1.00`
   - Main pages (about-us, contact-us, products, services): `0.80`
   - Directory indexes (insights, whitepapers, events, careers): `0.80`
   - Blog posts / Insights: `0.70`
   - Career pages: `0.64`
   - Other pages: `0.64`
6. **Uses** file modification dates for `lastmod` timestamps
7. **Creates** a backup of the existing sitemap before generating a new one

## When to Run

Run this script:

- ✅ After adding new pages to the website
- ✅ After updating existing pages (lastmod dates update automatically)
- ✅ Before deploying to production
- ✅ Periodically to keep the sitemap up-to-date

## Output

- Generates: `sitemap.xml` in the project root
- Backup: `sitemap.xml.backup` (created automatically)
- Console output shows total URLs and preview of first 10 entries

## Configuration

To customize the script, edit these variables at the top of `generate-sitemap.ps1`:

- `$baseUrl`: Your website URL (default: `https://ecoprism.com`)
- `$excludeDirs`: Directories to exclude from scanning
- `$excludeFiles`: Files to exclude from scanning
- `Get-Priority` function: Customize priority assignment logic

## Examples

```powershell
# Generate sitemap
.\generate-sitemap.ps1

# Output example:
# Scanning for HTML files...
# Found 111 HTML files to process
# Generating sitemap.xml...
# Sitemap generated successfully!
#   Location: C:\Users\inno\Desktop\eco11122025\sitemap.xml
#   Total URLs: 111
```

## Notes

- The script preserves the XML sitemap format compatible with Google Search Console
- Directory index pages (like `resources/insights/`) get trailing slashes in URLs
- File modification dates are automatically used for `lastmod` timestamps
- All URLs are generated without `.html` extensions to match your clean URL structure
