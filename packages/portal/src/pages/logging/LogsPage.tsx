import { API_BASE_URL } from "@config/api";
import { useEffect, useReducer, useRef } from "react";

const syslogLevels = {
  emerg: 0,
  alert: 1,
  crit: 2,
  error: 3,
  warning: 4,
  notice: 5,
  info: 6,
  debug: 7,
  trace: 8,
};

// Simple text printing logger
// Uses server-side-events from API_URL/api/logs
export function LogsPage() {
  const eventSource = useRef<EventSource | null>(null);
  const [logs, appendLog] = useReducer(
    (
      logs: string[],
      {
        message,
        level,
      }: {
        message: string;
        level: string;
      }
    ) => [...logs, `${level}: ${message}`],
    []
  );

  useEffect(() => {
    console.log("Opening event source");
    eventSource.current = new EventSource(`${API_BASE_URL}/api/logs`, {
      withCredentials: true,
    });

    Object.keys(syslogLevels).forEach((level) => {
      eventSource.current?.addEventListener(level, (e) => {
        appendLog({ level, message: String(e.data) });
      });
    });
    eventSource.current.onerror = () => {
      appendLog({ level: "client", message: "~~~ ERROR ~~~" });
    };
    eventSource.current.onopen = () => {
      appendLog({ level: "client", message: "OPEN" });
    };
    return () => {
      console.log("Closing event source");
      eventSource.current?.close();
    };
  }, [appendLog]);

  return (
    <div>
      <h1>Logs</h1>
      <output>
        <pre>{logs.join("\n")}</pre>
      </output>
    </div>
  );
}
