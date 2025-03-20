
# Imagem base multi-arquitetura
FROM node:20-alpine as builder

# Diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm ci

# Copia o código fonte
COPY . .

# Constrói a aplicação
RUN npm run build

# Estágio de produção
FROM nginx:alpine

# Copia os arquivos de build para o diretório de servir do nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia configuração personalizada do nginx se necessário
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80
EXPOSE 80

# Comando para iniciar o nginx
CMD ["nginx", "-g", "daemon off;"]
