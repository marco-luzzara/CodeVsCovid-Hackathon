$this_folder = $(pwd)

try 
{
    Set-Location -Path "./backend"
    $p_backend = Start-Process -FilePath "npm" -ArgumentList "start" -PassThru

    Set-Location -Path "../frontend"
    $p_frontend = Start-Process -FilePath "npm" -ArgumentList "run", "install_and_start" -PassThru

    Set-Location -Path "../datascience"
    $p_datascience_pip = Start-Process -FilePath "pip" -ArgumentList "install", "-r", "requirements.txt" -PassThru
    $p_datascience_python = Start-Process -FilePath "python" -ArgumentList "news_crawler.py" -PassThru

    Read-Host "Press any key if you want to close the app: "
} 
finally 
{
    Set-Location -Path "$this_folder"

    taskkill /f /t /pid $p_backend.Id
    taskkill /f /t /pid $p_frontend.Id
    taskkill /f /t /pid $p_datascience_pip.Id
    taskkill /f /t /pid $p_datascience_python.Id
}