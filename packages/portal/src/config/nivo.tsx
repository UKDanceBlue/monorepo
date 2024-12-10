import type { Theme } from "@nivo/core";
import { ThemeProvider } from "@nivo/core";
import useToken from "antd/es/theme/useToken.js";

export function NivoThemeProvider({ children }: { children: React.ReactNode }) {
  const [, token] = useToken();

  const nivoTheme: Theme = {
    background: token.colorBgContainer,
    text: {
      fontSize: 11,
      fill: token.colorTextLightSolid,
      outlineWidth: 0,
      outlineColor: "transparent",
    },
    axis: {
      domain: {
        line: {
          stroke: "#777777",
          strokeWidth: 1,
        },
      },
      legend: {
        text: {
          fontSize: 12,
          fill: token.colorText,
          outlineWidth: 0,
          outlineColor: "transparent",
        },
      },
      ticks: {
        line: {
          stroke: "#777777",
          strokeWidth: 1,
        },
        text: {
          fontSize: 11,
          fill: token.colorText,
          outlineWidth: 0,
          outlineColor: "transparent",
        },
      },
    },
    grid: {
      line: {
        stroke: "#dddddd",
        strokeWidth: 1,
      },
    },
    legends: {
      title: {
        text: {
          fontSize: 11,
          fill: token.colorText,
          outlineWidth: 0,
          outlineColor: "transparent",
        },
      },
      text: {
        fontSize: 11,
        fill: token.colorText,
        outlineWidth: 0,
        outlineColor: "transparent",
      },
      ticks: {
        line: {},
        text: {
          fontSize: 10,
          fill: token.colorText,
          outlineWidth: 0,
          outlineColor: "transparent",
        },
      },
    },
    annotations: {
      text: {
        fontSize: 13,
        fill: token.colorText,
        outlineWidth: 2,
        outlineColor: token.colorPrimaryBorder,
        outlineOpacity: 1,
      },
      link: {
        stroke: token.colorText,
        strokeWidth: 1,
        outlineWidth: 2,
        outlineColor: token.colorPrimaryBorder,
        outlineOpacity: 1,
      },
      outline: {
        stroke: token.colorText,
        strokeWidth: 2,
        outlineWidth: 2,
        outlineColor: token.colorPrimaryBorder,
        outlineOpacity: 1,
      },
      symbol: {
        fill: token.colorText,
        outlineWidth: 2,
        outlineColor: token.colorPrimaryBorder,
        outlineOpacity: 1,
      },
    },
    tooltip: {
      wrapper: {},
      container: {
        background: token.colorBgElevated,
        color: token.colorText,
        fontSize: 12,
      },
      basic: {},
      chip: {},
      table: {},
      tableCell: {},
      tableCellValue: {},
    },
  };

  return <ThemeProvider theme={nivoTheme}>{children}</ThemeProvider>;
}
