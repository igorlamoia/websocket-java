"use client";

import type { ReactNode } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useSocketClient } from "../hook/useSocketClient";
import { Typography } from "../components/typography";
import { Panel } from "../components/panel";
import { SectionHeader } from "../components/section-header";

const chartTheme = {
  grid: "var(--color-chart-grid)",
  tick: "var(--color-chart-tick)",
  tooltipBackground: "var(--color-chart-tooltip-bg)",
  tooltipBorder: "1px solid var(--color-chart-tooltip-border)",
  tooltipText: "var(--color-chart-tooltip-text)",
  line: "var(--color-chart-line)",
};

function ListRow({ children }: { children: ReactNode }) {
  return (
    <li className="flex justify-between gap-4 border-t border-[rgba(22,33,29,0.12)] py-3.5 first:border-t-0 first:pt-0 max-sm:flex-col">
      {children}
    </li>
  );
}

export function PresenceDashboard() {
  const { currentCount, history, status } = useSocketClient();
  const statusTone = status === "ao vivo" ? "live" : "idle";

  return (
    <main className="mx-auto w-[min(1180px,calc(100vw-32px))] px-0 py-12 max-sm:w-[min(100vw-20px,100%)] max-sm:py-5">
      <section className="grid grid-cols-[1.5fr_0.9fr] gap-6 items-stretch max-[960px]:grid-cols-1">
        <div className="relative overflow-hidden rounded-[28px] border border-[rgba(22,33,29,0.12)] bg-[rgba(248,244,234,0.82)] p-8 shadow-[0_24px_60px_rgba(31,36,27,0.12)] backdrop-blur-sm max-sm:rounded-[22px] max-sm:p-5">
          <Typography variant="sectionKicker">
            Local Dev Control Room
          </Typography>
          <Typography as="h1" variant="heroTitle">
            Presenca em tempo real
          </Typography>
          <Typography variant="heroBody">
            O frontend roda em <code>localhost:3000</code>. O backend expõe HTTP
            e WebSocket em <code>localhost:8080</code>
          </Typography>
        </div>

        <div className="relative flex flex-col justify-end gap-3.5 overflow-hidden rounded-[28px] border border-[rgba(22,33,29,0.12)] bg-[linear-gradient(180deg,rgba(196,255,72,0.14),transparent_38%),linear-gradient(135deg,#16211d_0%,#202a26_100%)] p-8 text-chart-tooltip-text shadow-[0_24px_60px_rgba(31,36,27,0.12)] backdrop-blur-sm max-sm:rounded-[22px] max-sm:p-5">
          <Typography as="span" variant="metricLabel">
            Clientes conectados
          </Typography>
          <Typography as="strong" variant="metricValue">
            {currentCount}
          </Typography>
          <StatusPill statusTone={statusTone} label={status} />
        </div>
      </section>

      <section className="mt-6 grid grid-cols-[1.4fr_1fr] gap-6 max-[960px]:grid-cols-1">
        <Panel extraClassName="min-h-[400px]">
          <SectionHeader
            kicker="WebSocket histórico"
            title="Historico recente"
            aside={
              <span className="rounded-full bg-[rgba(196,255,72,0.18)] px-3.5 py-2.5 text-[0.8rem] text-[#2d4100]">
                /topic/presence
              </span>
            }
          />

          <div className="mt-7 h-70">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid stroke={chartTheme.grid} vertical={false} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: chartTheme.tick, fontSize: 11 }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: chartTheme.tick, fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: chartTheme.tooltipBackground,
                    border: chartTheme.tooltipBorder,
                    borderRadius: "16px",
                    color: chartTheme.tooltipText,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={chartTheme.line}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: chartTheme.line }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <SectionHeader
            kicker="HTTP Iniciallização"
            title="Endpoints locais"
          />

          <ul className="m-0 mt-6 list-none p-0">
            <ListRow>
              <span>Snapshot inicial</span>
              <code>GET http://localhost:8080/api/presence</code>
            </ListRow>
            <ListRow>
              <span>Handshake SockJS</span>
              <code>http://localhost:8080/ws</code>
            </ListRow>
            <ListRow>
              <span>Topico STOMP</span>
              <code>/topic/presence</code>
            </ListRow>
          </ul>
        </Panel>
      </section>
    </main>
  );
}

function StatusPill({
  statusTone,
  label,
}: {
  statusTone: "live" | "idle";
  label: string;
}) {
  return (
    <span
      className={`w-fit rounded-full border border-[rgba(248,244,234,0.14)] bg-[rgba(248,244,234,0.12)] px-3.5 py-2.5 text-[0.88rem] lowercase ${
        statusTone === "live" ? "text-chart-line" : "text-chart-tooltip-text"
      }`}
    >
      {label}
    </span>
  );
}
