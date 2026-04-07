# Spring Boot em Docker + Next.js local

Estrutura esperada:

```txt
/project-root
  /frontend
  /backend
  compose.dev.yaml
  README.md
```

## Como rodar

### Backend

```bash
docker compose -f compose.dev.yaml up --build
```

O backend sobe no container em `http://localhost:8080` usando `./mvnw spring-boot:run`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend sobe em `http://localhost:3000` e já aponta para `http://localhost:8080`.

## O que está incluído

- Backend Spring Boot 3 com:
  - `spring-boot-starter-web`
  - `spring-boot-starter-websocket`
  - `spring-boot-devtools`
  - endpoint HTTP `GET /api/presence`
  - endpoint SockJS/STOMP em `/ws`
  - tópico `/topic/presence`
  - CORS liberado para `http://localhost:3000`
- Frontend Next.js com:
  - dashboard simples em tempo real
  - conexão SockJS + STOMP
  - gráfico com Recharts
- Docker Compose de desenvolvimento com:
  - somente o backend
  - bind mount do código em `./backend`
  - volume para cache Maven

## Fluxo de DX

- Alterações em `frontend/` usam o hot reload do Next.js local.
- Alterações em `backend/src` são recompiladas dentro do container por `dev-entrypoint.sh`.
- O Spring Boot DevTools detecta a atualização em `target/classes` e reinicia a aplicação sem rebuild manual da imagem.

## Observações sobre DevTools em container

- O DevTools sozinho não recompila arquivos `.java`; ele reinicia quando as classes compiladas mudam.
- Por isso, o container roda um watcher com `inotifywait` para executar `./mvnw compile test-compile` quando `backend/src` muda.
- Em Docker Desktop pode haver um pequeno atraso nos eventos do bind mount, mas o fluxo continua sem rebuild de imagem.
- Se você alterar `pom.xml`, o mais seguro é reiniciar o serviço com `docker compose -f compose.dev.yaml up --build`.

## Endpoints

- HTTP: `http://localhost:8080/api/presence`
- SockJS handshake: `http://localhost:8080/ws`
- Tópico STOMP: `/topic/presence`
