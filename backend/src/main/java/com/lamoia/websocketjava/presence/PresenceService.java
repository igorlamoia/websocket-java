package com.lamoia.websocketjava.presence;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PresenceService {

    private final Set<String> connectedSessions = ConcurrentHashMap.newKeySet();

    public PresenceCountResponse connect(String sessionId) {
        connectedSessions.add(sessionId);
        return snapshot();
    }

    public PresenceCountResponse disconnect(String sessionId) {
        connectedSessions.remove(sessionId);
        return snapshot();
    }

    public PresenceCountResponse snapshot() {
        return new PresenceCountResponse(connectedSessions.size(), Instant.now());
    }
}
