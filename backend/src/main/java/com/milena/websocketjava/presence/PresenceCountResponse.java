package com.milena.websocketjava.presence;

import java.time.Instant;

public record PresenceCountResponse(int connectedUsers, Instant updatedAt) {
}
