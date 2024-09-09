import { Table } from "antd";

export function LogViewer({ logs }: { logs: string | undefined }) {
  const logLines = logs?.trim().split("\n") ?? [];
  const logData = logLines.map((line) => {
    try {
      const { level, message, timestamp, ...extra } = JSON.parse(line) as {
        level: string;
        message: string;
        timestamp: string;
        [key: string]: unknown;
      };
      const parsedTimestamp = new Date(timestamp);

      let combinedMessage = message;
      if (Object.keys(extra).length > 0) {
        combinedMessage += `\n${JSON.stringify(extra, null, 2)}`;
      }

      // return `${parsedTimestamp.toLocaleString()} [${level}] ${message} ${JSON.stringify(extra)}`;
      return {
        timestamp: parsedTimestamp.toLocaleString(),
        level,
        message: combinedMessage,
      };
    } catch {
      return {
        timestamp: undefined,
        level: "unknown",
        message: line,
      };
    }
  });

  return (
    <Table
      dataSource={logData}
      columns={[
        {
          title: "Timestamp",
          dataIndex: "timestamp",
          key: "timestamp",
          width: 150,
        },
        {
          title: "Level",
          dataIndex: "level",
          key: "level",
          width: 50,
          filters: [
            { text: "unknown", value: "unknown" },
            { text: "info", value: "info" },
            { text: "insecure", value: "insecure" },
            { text: "secure", value: "secure" },
            { text: "dangerous", value: "dangerous" },
          ],
          defaultFilteredValue: ["unknown", "secure", "dangerous"],
          filterMultiple: true,
          onFilter: (value, record) => record.level === value,
        },
        {
          title: "Message",
          dataIndex: "message",
          key: "message",
          width: 800,
          render: (text: string) => <pre>{text}</pre>,
        },
      ]}
      pagination={false}
    />
  );
}
