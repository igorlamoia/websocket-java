import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { startTransition, useEffect, useState } from "react";

import { api, getSockJsUrl } from "../lib/api";
import { formatLabel } from "../util/format";

export type PresenceSnapshot = {
  connectedUsers: number;
  updatedAt: string | null;
};

export type ChartPoint = {
  count: number;
  label: string;
};

const MAX_POINTS = 24;

function pushSnapshot(
  snapshot: PresenceSnapshot,
  setCurrentCount: (value: number) => void,
  setHistory: React.Dispatch<React.SetStateAction<ChartPoint[]>>,
  isActive: boolean,
) {
  if (!isActive) {
    return;
  }

  startTransition(() => {
    setCurrentCount(snapshot.connectedUsers);
    setHistory((previous) => {
      const nextPoint = {
        count: snapshot.connectedUsers,
        label: formatLabel(snapshot.updatedAt),
      };
      return [...previous, nextPoint].slice(-MAX_POINTS);
    });
  });
}

async function loadPresenceSnapshot(
  isActive: boolean,
  pushSnapshot: (snapshot: PresenceSnapshot) => void,
  setStatus: (status: string) => void,
) {
  try {
    const response = await api.get<PresenceSnapshot>("/api/presence");
    if (isActive) pushSnapshot(response.data);
  } catch {
    if (isActive) setStatus("backend indisponível");
  }
}

export function useSocketClient() {
  const [currentCount, setCurrentCount] = useState(0);
  const [history, setHistory] = useState<ChartPoint[]>([]);
  const [status, setStatus] = useState("conectando");

  useEffect(() => {
    let isActive = true;

    void loadPresenceSnapshot(
      isActive,
      (snapshot) =>
        pushSnapshot(snapshot, setCurrentCount, setHistory, isActive),
      setStatus,
    );

    const client = new Client({
      reconnectDelay: 1500,
      webSocketFactory: () => new SockJS(getSockJsUrl()),
      onConnect: () => {
        if (!isActive) return;

        setStatus("ao vivo");
        client.subscribe("/topic/presence", (frame) => {
          const snapshotObject: PresenceSnapshot = JSON.parse(frame.body);
          pushSnapshot(snapshotObject, setCurrentCount, setHistory, isActive);
        });
      },
      onStompError: () => {
        if (isActive) setStatus("erro no broker");
      },
      onWebSocketClose: () => {
        if (isActive) setStatus("reconectando");
      },
    });

    client.activate();

    return () => {
      isActive = false;
      client.deactivate();
    };
  }, []);

  return {
    currentCount,
    history,
    status,
  };
}
