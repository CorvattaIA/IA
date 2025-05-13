# Usa una imagen ligera de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia manifest y lock para optimizar la instalación
COPY package*.json ./

# Instala solo dependencias de producción
RUN npm install --production

# Copia el resto del código
COPY . .

# Genera la build estática
RUN npm run build

# Expon el puerto que usará el contenedor
EXPOSE 3000

# Comando por defecto para servir la aplicación
CMD ["npx", "serve", "-s", "build"] 