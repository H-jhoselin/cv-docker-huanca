# CV Personal – Jhoselin Huanca Torres

Aplicación web de CV personal con **React + Nginx**, **Node.js** y **MySQL**, orquestada con **Docker Compose**.

## Arquitectura

| Servicio | Tecnología | Imagen | Puerto |
|---|---|---|---|
| frontend | React + Nginx | `jhosstorrez/huanca-frontend:v1` (base `nginx:1.27-alpine`) | 3000 |
| backend | Node.js (Express) | `jhosstorrez/huanca-backend:v1` (base `node:20-alpine`) | 4000 |
| database | MySQL | `mysql:8.0` | 3306 |

- Red única: `cv_network`
- Volumen de persistencia: `mysql_data`
- Endpoint: `GET /cv` → `{ persona, formacion }` en JSON
- El frontend llama a `/api/cv`; Nginx lo reenvía a `http://backend:4000/cv`.

## Estructura

```
proyecto/
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── index.html
│   ├── src/
│   └── public/          ← colocar aquí foto.jpg
├── backend/
│   ├── Dockerfile
│   ├── server.js
│   └── package.json
├── database/
│   └── init.sql         ← montado en /docker-entrypoint-initdb.d/init.sql
├── docker-compose.yml
└── .env                 ← usuario de Docker Hub
```

## 1. Construir y publicar las imágenes

```powershell
docker login
docker build -t jhosstorrez/huanca-backend:v1 ./backend
docker build -t jhosstorrez/huanca-frontend:v1 ./frontend
docker push jhosstorrez/huanca-backend:v1
docker push jhosstorrez/huanca-frontend:v1
```

O con el script incluido:

```powershell
.\build-and-push.ps1 -Usuario jhosstorrez
```

## 2. Ejecutar la aplicación

1. Clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <carpeta_del_proyecto>
   ```
2. Verificar que el archivo `.env` tenga el usuario de Docker Hub correcto:
   ```
   DOCKERHUB_USER=jhosstorrez
   ```
3. Iniciar la aplicación:
   ```bash
   docker compose up -d
   ```
4. Abrir en el navegador: **http://localhost:3000**

## Comprobaciones

```bash
docker compose ps                     # estado de los contenedores
docker compose logs database          # ejecución de init.sql
docker exec -it cv_database mysql -ucv_user -pcv_password cv_db -e "SHOW TABLES; SELECT * FROM persona; SELECT * FROM formacion;"
curl http://localhost:4000/cv         # respuesta JSON del backend
```

## Reiniciar la base de datos

`init.sql` solo se ejecuta cuando el volumen está vacío. Para volver a ejecutarlo:

```bash
docker compose down -v
docker compose up -d
```
