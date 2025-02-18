# Server
PORT=:8080
APP_ENV=development

# Database
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=postgres5
DB_PORT=5432
SSL_MODE=disable
TIMEZONE=Asia/Shanghai

# Bcrypt
BCRYPT_COST=5

# Redis
REDIS_HOST=localhost:6379
REDIS_PASSWORD=

# JWT 
JWT_SECRET=my_jwt_secret

# Seed 
CHAR_SET=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789


docker stop gin-container
docker rm gin-container
docker rmi binary_backend:latest
docker build -t binary_backend .
docker run -d --name gin-container --network=binary --env-file .env -p 0.0.0.0:8080:8080 binary_backend

# 빌드 시에 env 바꾸기 ( network도 ) 
# 빌드 시에 프론트 env 바꾸기
