package com.lamoia.websocketjava.presence;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class PresenceServiceTest {

    @Test
    void connectCountsEachSessionOnlyOnce() {
        PresenceService service = new PresenceService();

        PresenceCountResponse firstSnapshot = service.connect("session-a");
        PresenceCountResponse duplicateSnapshot = service.connect("session-a");
        PresenceCountResponse secondSessionSnapshot = service.connect("session-b");

        assertThat(firstSnapshot.connectedUsers()).isEqualTo(1);
        assertThat(duplicateSnapshot.connectedUsers()).isEqualTo(1);
        assertThat(secondSessionSnapshot.connectedUsers()).isEqualTo(2);
    }

    @Test
    void disconnectRemovesOnlyExistingSessions() {
        PresenceService service = new PresenceService();
        service.connect("session-a");
        service.connect("session-b");

        PresenceCountResponse firstDisconnect = service.disconnect("session-a");
        PresenceCountResponse missingDisconnect = service.disconnect("missing");
        PresenceCountResponse secondDisconnect = service.disconnect("session-b");

        assertThat(firstDisconnect.connectedUsers()).isEqualTo(1);
        assertThat(missingDisconnect.connectedUsers()).isEqualTo(1);
        assertThat(secondDisconnect.connectedUsers()).isEqualTo(0);
    }
}
