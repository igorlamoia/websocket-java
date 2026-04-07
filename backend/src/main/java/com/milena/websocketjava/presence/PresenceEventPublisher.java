package com.milena.websocketjava.presence;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class PresenceEventPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public PresenceEventPublisher(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void publish(PresenceCountResponse snapshot) {
        messagingTemplate.convertAndSend("/topic/presence", snapshot);
    }
}
