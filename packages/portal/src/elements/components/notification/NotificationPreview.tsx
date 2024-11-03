import AppLogo from "#assets/app-icon.png";
import { Avatar, Typography } from "antd";

export const NotificationPreview = ({
  title,
  body,
}: {
  title: string;
  body: string;
}) => {
  const trimmedTitle = title.length > 35 ? `${title.slice(0, 35)}...` : title;
  const trimmedBody = body.length > 70 ? `${body.slice(0, 70)}...` : body;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        width: "50ch",
      }}
    >
      <Avatar
        src={AppLogo}
        style={{
          backgroundColor: "#1890ff",
          marginRight: "12px",
          borderRadius: "8px",
        }}
      />
      <div style={{ width: "38ch" }}>
        <Typography style={{ margin: 0, fontWeight: "bold" }}>
          {trimmedTitle}
        </Typography>
        <Typography style={{ margin: 0 }}>{trimmedBody}</Typography>
      </div>
    </div>
  );
};
