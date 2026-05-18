@echo off
color 0B
title CodingManager Full Stack Launcher

echo ====================================================
echo        Starting CodingManager Application
echo ====================================================
echo.

echo [1/2] Starting Spring Boot Backend...
cd CodingManager
start "CodingManager Backend" cmd /k "mvnw.cmd spring-boot:run"
cd ..

echo [2/2] Starting React Frontend...
cd frontend
start "CodingManager Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ====================================================
echo  Servers are starting in separate windows!
echo  Backend: http://localhost:8080 (Check console)
echo  Frontend: http://localhost:5173
echo ====================================================
echo.
echo Press any key to exit this launcher...
pause >nul
