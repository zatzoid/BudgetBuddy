@echo off

rem Запуск бэкэнда
cd back
start npm run dev

rem Переход обратно в корневую папку
cd ..

rem Запуск фронтенда
cd front
start npm run dev