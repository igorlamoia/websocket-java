package com.lamoia.websocketjava.presence;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class PresenceSessionListener {

    private final PresenceService presenceService;
    private final PresenceEventPublisher publisher;

    public PresenceSessionListener(PresenceService presenceService, PresenceEventPublisher publisher) {
        this.presenceService = presenceService;
        this.publisher = publisher;
    }

    @EventListener
    public void onSessionConnected(SessionConnectedEvent event) {
        String sessionId = StompHeaderAccessor.wrap(event.getMessage()).getSessionId();
        if (sessionId != null) {
            handleConnect(sessionId);
        }
    }

    @EventListener
    public void onSessionDisconnected(SessionDisconnectEvent event) {
        String sessionId = StompHeaderAccessor.wrap(event.getMessage()).getSessionId();
        if (sessionId != null) {
            handleDisconnect(sessionId);
        }
    }

    void handleConnect(String sessionId) {
        publisher.publish(presenceService.connect(sessionId));
    }

    void handleDisconnect(String sessionId) {
        publisher.publish(presenceService.disconnect(sessionId));
    }
}
