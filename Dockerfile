FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y curl bash

# Install NVM + Node 24 + npm + dependencies in one layer
ENV NVM_DIR=/root/.nvm
RUN bash -c "\
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash && \
  . $NVM_DIR/nvm.sh && \
  nvm install 24 && \
  nvm use 24 && \
  nvm alias default 24 && \
  npm install -g npm@latest && \
  ln -s $NVM_DIR/versions/node/v24.*/bin/node /usr/local/bin/node && \
  ln -s $NVM_DIR/versions/node/v24.*/bin/npm /usr/local/bin/npm \
"

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Environment variables (can be overridden at runtime)
ENV PORT=5000 \
    DATABASE_URL="postgresql://neondb_owner:npg_TklxG8O0RCUh@ep-snowy-leaf-a17bj030-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" \
    JWT_SECRET="samuel"

EXPOSE 5000
CMD ["node", "index.js"]
