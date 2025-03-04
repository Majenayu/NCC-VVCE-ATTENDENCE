@echo off
cd /d C:\AttendanceApp
git init
git add .
git commit -m "Automated commit"
git branch -M main
git remote add origin https://github.com/Majenayu/NCC-VVCE-ATTENDENCE.git
git push -u origin main
echo Done!
pause
