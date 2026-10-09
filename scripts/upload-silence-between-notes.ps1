# One-time public soundtrack import for Yoga Instructor.
# Requires a clean local git checkout and an authenticated GitHub CLI for auto PR.
# Does not modify main or any other portfolio project.
param([string]$FilePath)
$ErrorActionPreference = "Stop"
$repo = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
if (-not (Test-Path (Join-Path $repo ".git"))) { throw "Run this script from a clone of yoga-instructor." }
$dirty = git -C $repo status --porcelain
if ($dirty) { throw "There are uncommitted changes. Commit or stash them first; nothing was changed." }
if (-not $FilePath) {
 Add-Type -AssemblyName System.Windows.Forms
 $picker = New-Object System.Windows.Forms.OpenFileDialog
 $picker.Title = "Selecciona Silence Between Notes.mp3"
 $picker.Filter = "MP3 (*.mp3)|*.mp3"
 if ($picker.ShowDialog() -ne [System.Windows.Forms.DialogResult]::OK) { return }
 $FilePath = $picker.FileName
}
if (-not (Test-Path -LiteralPath $FilePath)) { throw "MP3 file not found: $FilePath" }
if ([System.IO.Path]::GetExtension($FilePath).ToLowerInvariant() -ne ".mp3") { throw "Choose an MP3 file." }
if ((Get-Item -LiteralPath $FilePath).Length -gt 10000000) { throw "MP3 exceeds the 10 MB sound budget." }
$branch="audio/silence-between-notes-2026"
git -C $repo fetch origin main
if ($LASTEXITCODE -ne 0) { throw "Git fetch failed." }
git -C $repo switch -c $branch origin/main
if ($LASTEXITCODE -ne 0) { throw "Could not create audio branch (it may already exist)." }
$dest = Join-Path $repo "audio/silence-between-notes.mp3"
Copy-Item -LiteralPath $FilePath -Destination $dest
git -C $repo add -- audio/silence-between-notes.mp3
git -C $repo commit -m "audio: add Silence Between Notes for breathing sanctuary"
if ($LASTEXITCODE -ne 0) { throw "Git commit failed." }
git -C $repo push -u origin $branch
if ($LASTEXITCODE -ne 0) { throw "Git push failed. File and commit remain in your local branch." }
$gh=Get-Command gh -ErrorAction SilentlyContinue
if($gh) {
 gh -R GracianB/yoga-instructor pr create --base main --head $branch --title "Yoga: add Silence Between Notes soundtrack" --body "Original owner-provided MP3 for the opt-in Breathing Atelier soundtrack. CI and Pages integrity required."
} else {
 Write-Host "Branch pushed. Open a PR on GitHub from $branch into main, then merge after CI."
}
Write-Host "MP3 SHA-256:" (Get-FileHash -LiteralPath $dest -Algorithm SHA256).Hash
