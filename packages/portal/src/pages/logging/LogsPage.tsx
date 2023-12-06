import { API_BASE_URL } from "@config/api";
import { useEffect, useState } from "react";

// Simple text printing logger
// Uses server-side-events from API_URL/api/logs
export function LogsPage() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const eventSource = new EventSource(`${API_BASE_URL}/api/logs`, {
      withCredentials: true,
    });
    eventSource.onopen = (event) => {
      console.log(event);
      setLogs((logs) => [...logs, "Connected"]);
    };
    eventSource.onmessage = (event) => {
      console.log(event);
      setLogs((logs) => [...logs, String(event.data)]);
    };
    return () => eventSource.close();
  }, []);

  return (
    <div>
      <h1>Logs</h1>
      <output>
        <pre>{logs.join("\n")}</pre>
      </output>
    </div>
  );
}
