# Construye y publica las imágenes en Docker Hub
# Uso: .\build-and-push.ps1 -Usuario tu_usuario_dockerhub

param(
    [Parameter(Mandatory = $true)]
    [string]$Usuario
)

docker login
if (-not $?) { exit 1 }

docker build -t "$Usuario/huanca-backend:v1" ./backend
if (-not $?) { exit 1 }

docker build -t "$Usuario/huanca-frontend:v1" ./frontend
if (-not $?) { exit 1 }

docker push "$Usuario/huanca-backend:v1"
if (-not $?) { exit 1 }

docker push "$Usuario/huanca-frontend:v1"
