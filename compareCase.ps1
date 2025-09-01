# Liste des fichiers vus par Git
$gitFiles = git ls-files

# Liste réelle sur disque
$diskFiles = Get-ChildItem -Recurse -File | ForEach-Object { $_.FullName.Replace((Get-Location).Path + "\", "").Replace("\", "/") }

# Cherche les différences de casse
foreach ($gf in $gitFiles) {
    $match = $diskFiles | Where-Object { $_.ToLower() -eq $gf.ToLower() }
    if ($match -and ($match -notcontains $gf)) {
        Write-Host "Différence de casse : Git='$gf' / Disque='$match'"
    }
}
