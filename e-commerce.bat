@echo off
cd /d "C:\Users\wojte\Projects\e-commerce"

REM Start the first command in the current Command Prompt window
start cmd /k "npx nx serve client-web-app"

REM Start a new Command Prompt window and run the second command
start cmd /k "cd /d C:\Users\wojte\Projects\e-commerce && npx nx serve server"