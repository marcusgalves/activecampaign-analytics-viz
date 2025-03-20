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

# Estágio de produção usando uma imagem leve com servidor web simples
FROM node:20-alpine

# Instala um servidor web simples
RUN npm install -g serve

# Cria diretório para a aplicação
WORKDIR /app

# Copia os arquivos de build
COPY --from=builder /app/dist /app

# Expõe a porta 3000 (que o serve usa por padrão)
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["serve", "-s", ".", "-l", "3000"]
