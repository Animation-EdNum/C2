@echo off
REM ========================================================
REM  run_tests.bat - Lance tous les tests du projet C2
REM  Usage : double-clic ou exécuter depuis la racine du repo
REM ========================================================

echo.
echo  ====================================================
echo   Lancement des tests - Education Numerique C2
echo  ====================================================
echo.

REM --- Vérification de Python ---
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Python n'est pas installe ou pas dans le PATH.
    echo Installer Python depuis https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [1/3] Installation des dependances (playwright + pytest)...
pip install playwright pytest --quiet
if %errorlevel% neq 0 (
    echo [ERREUR] Impossible d'installer les dependances.
    pause
    exit /b 1
)

echo [2/3] Installation des navigateurs Playwright...
python -m playwright install chromium --quiet
if %errorlevel% neq 0 (
    echo [ERREUR] Impossible d'installer Chromium pour Playwright.
    pause
    exit /b 1
)

echo [3/3] Execution des tests...
echo.

REM --- On se place à la racine du projet ---
cd /d "%~dp0"

REM --- Lancer pytest sur le dossier tests/ ---
python -m pytest tests/ -v --tb=short
set EXIT_CODE=%errorlevel%

echo.
if %EXIT_CODE% equ 0 (
    echo  [OK] Tous les tests sont passes avec succes !
) else (
    echo  [ECHEC] Certains tests ont echoue. Voir les details ci-dessus.
)

echo.
pause
exit /b %EXIT_CODE%
