# Local Dev Architecture Design

**Goal:** criar uma base mínima com `frontend/` em Next.js local e `backend/` em Spring Boot rodando via Docker, sem exigir Java local para o fluxo normal de desenvolvimento.

**Abordagem escolhida:** usar um backend Spring Boot 3.x com STOMP + SockJS, bind mount do código no container e `./mvnw spring-boot:run`. Para refletir mudanças Java sem rebuild de imagem, o container roda um watcher simples que recompila classes quando `src/` muda; o DevTools detecta a alteração em `target/classes` e reinicia a aplicação.

**Alternativas descartadas:**
- Rodar frontend e backend em Docker: pior DX para Next no desenvolvimento.
- Rebuild de imagem a cada alteração Java: quebra o objetivo principal de iteração rápida.
- WebSocket puro sem STOMP: menos código no cliente, mas pior para exemplo de broadcast simples com dashboard.
