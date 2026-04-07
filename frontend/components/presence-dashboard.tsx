"use client";

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { startTransition, useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getApiBaseUrl, getSockJsUrl } from "../lib/backend";

type PresenceSnapshot = {
  connectedUsers: number;
  updatedAt: string | null;
};

type ChartPoint = {
  count: number;
  label: string;
};

const MAX_POINTS = 24;

function formatLabel(timestamp: string | null) {
  if (!timestamp) {
    return "agora";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(timestamp));
}

export function PresenceDashboard() {
  const [currentCount, setCurrentCount] = useState(0);
  const [history, setHistory] = useState<ChartPoint[]>([]);
  const [status, setStatus] = useState("conectando");
  const statusTone = status === "ao vivo" ? "live" : "idle";

  useEffect(() => {
    let isActive = true;

    const pushSnapshot = (snapshot: PresenceSnapshot) => {
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
    };

    fetch(`${getApiBaseUrl()}/api/presence`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json() as Promise<PresenceSnapshot>;
      })
      .then((snapshot) => {
        pushSnapshot(snapshot);
      })
      .catch(() => {
        if (isActive) {
          setStatus("backend indisponível");
        }
      });

    const client = new Client({
      reconnectDelay: 1500,
      webSocketFactory: () => new SockJS(getSockJsUrl()),
      onConnect: () => {
        if (!isActive) {
          return;
        }

        setStatus("ao vivo");
        client.subscribe("/topic/presence", (frame) => {
          pushSnapshot(JSON.parse(frame.body) as PresenceSnapshot);
        });
      },
      onStompError: () => {
        if (isActive) {
          setStatus("erro no broker");
        }
      },
      onWebSocketClose: () => {
        if (isActive) {
          setStatus("reconectando");
        }
      },
    });

    client.activate();

    return () => {
      isActive = false;
      client.deactivate();
    };
  }, []);

  return (
    <main className="shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Local Dev Control Room</p>
          <h1>Presenca em tempo real</h1>
          <p className="lede">
            O frontend roda em <code>localhost:3000</code>. O backend expõe HTTP
            e WebSocket em <code>localhost:8080</code>
          </p>
        </div>

        <div className="hero-metric">
          <span className="metric-label">Clientes conectados</span>
          <strong>{currentCount}</strong>
          <span className={`metric-status metric-status-${statusTone}`}>
            {status}
          </span>
        </div>
      </section>

      <section className="panel-grid">
        <article className="panel panel-chart">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">WebSocket feed</p>
              <h2>Historico recente</h2>
            </div>
            <span className="panel-chip">/topic/presence</span>
          </div>

          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid
                  stroke="rgba(38, 48, 44, 0.14)"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#41534d", fontSize: 11 }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#41534d", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#16211d",
                    border: "1px solid rgba(196, 255, 72, 0.2)",
                    borderRadius: "16px",
                    color: "#f8f4ea",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#c4ff48"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: "#c4ff48" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">HTTP bootstrap</p>
              <h2>Endpoints locais</h2>
            </div>
          </div>

          <ul className="endpoint-list">
            <li>
              <span>Snapshot inicial</span>
              <code>GET http://localhost:8080/api/presence</code>
            </li>
            <li>
              <span>Handshake SockJS</span>
              <code>http://localhost:8080/ws</code>
            </li>
            <li>
              <span>Topico STOMP</span>
              <code>/topic/presence</code>
            </li>
          </ul>
        </article>

        <article className="panel panel-notes">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">DX notes</p>
              <h2>Fluxo de desenvolvimento</h2>
            </div>
          </div>

          <ol className="steps">
            <li>Suba o backend com Docker Compose.</li>
            <li>Instale dependências do frontend localmente.</li>
            <li>
              Edite arquivos em <code>frontend/</code> e use hot reload do Next.
            </li>
            <li>
              Edite arquivos em <code>backend/src</code> e deixe o watcher
              recompilar para o DevTools reiniciar.
            </li>
          </ol>
        </article>
      </section>
    </main>
  );
}
