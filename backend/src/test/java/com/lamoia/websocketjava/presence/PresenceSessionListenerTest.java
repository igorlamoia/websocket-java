package com.lamoia.websocketjava.presence;

import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class PresenceSessionListenerTest {

    @Test
    void publishesSnapshotWhenSessionConnects() {
        PresenceService service = mock(PresenceService.class);
        PresenceEventPublisher publisher = mock(PresenceEventPublisher.class);
        PresenceCountResponse snapshot = new PresenceCountResponse(3, null);
        PresenceSessionListener listener = new PresenceSessionListener(service, publisher);

        when(service.connect("session-a")).thenReturn(snapshot);

        listener.handleConnect("session-a");

        verify(service).connect("session-a");
        verify(publisher).publish(snapshot);
    }

    @Test
    void publishesSnapshotWhenSessionDisconnects() {
        PresenceService service = mock(PresenceService.class);
        PresenceEventPublisher publisher = mock(PresenceEventPublisher.class);
        PresenceCountResponse snapshot = new PresenceCountResponse(1, null);
        PresenceSessionListener listener = new PresenceSessionListener(service, publisher);

        when(service.disconnect("session-a")).thenReturn(snapshot);

        listener.handleDisconnect("session-a");

        verify(service).disconnect("session-a");
        verify(publisher).publish(snapshot);
    }
}
