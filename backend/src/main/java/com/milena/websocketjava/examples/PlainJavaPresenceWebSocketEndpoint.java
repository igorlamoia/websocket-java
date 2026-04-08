package com.milena.websocketjava.examples;

import jakarta.websocket.CloseReason;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;

import java.time.Instant;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@ServerEndpoint("/ws/plain/presence")
public class PlainJavaPresenceWebSocketEndpoint {

  private static final Set<Session> SESSIONS = new CopyOnWriteArraySet<>();
  private static final Set<String> ACTIVE_SESSION_IDS = ConcurrentHashMap.newKeySet();

  @OnOpen
  public void onOpen(Session session) {
    SESSIONS.add(session);
    ACTIVE_SESSION_IDS.add(session.getId());
    broadcastCurrentSnapshot();
  }

  @OnClose
  public void onClose(Session session, CloseReason reason) {
    SESSIONS.remove(session);
    ACTIVE_SESSION_IDS.remove(session.getId());
    broadcastCurrentSnapshot();
  }

  @OnError
  public void onError(Session session, Throwable throwable) {
    // Poderia guardar logs de erro aqui, mas é só explicativo mesmo XD.
  }

  private void broadcastCurrentSnapshot() {
    String payload = toJson(snapshot());

    for (Session session : SESSIONS) {
      if (session.isOpen()) {
        session.getAsyncRemote().sendText(payload);
      }
    }
  }

  private PresenceSnapshot snapshot() {
    return new PresenceSnapshot(ACTIVE_SESSION_IDS.size(), Instant.now());
  }

  private String toJson(PresenceSnapshot snapshot) {
    return "{"
        + "\"connectedUsers\":" + snapshot.connectedUsers() + ','
        + "\"updatedAt\":\"" + snapshot.updatedAt() + "\""
        + '}';
  }

  public record PresenceSnapshot(int connectedUsers, Instant updatedAt) {
  }
}