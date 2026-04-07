package com.lamoia.websocketjava.presence;

import java.time.Instant;

public record PresenceCountResponse(int connectedUsers, Instant updatedAt) {
}
