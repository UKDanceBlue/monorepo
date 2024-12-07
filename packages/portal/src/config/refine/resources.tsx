import {
  BellOutlined,
  CalendarOutlined,
  ContainerOutlined,
  DollarCircleOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FlagOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { Action, ResourceProps } from "@refinedev/core";

export const refineResources: ResourceProps[] = [
  {
    name: "event",
    meta: {
      icon: <CalendarOutlined />,
      label: "Events",
      nodeName: "EventNode",
    },
    create: "/events/create",
    edit: "/events/:id/edit",
    show: "/events/:id",
    list: "/events",
  },
  {
    name: "team",
    meta: {
      icon: <TeamOutlined />,
      label: "Teams",
      nodeName: "TeamNode",
    },
    create: "/teams/create",
    edit: "/teams/:id/edit",
    show: "/teams/:id",
    list: "/teams",
  },
  {
    name: "fundraising-group",
    meta: {
      icon: <DollarCircleOutlined />,
      label: "Fundraising",
    },
  },
  {
    name: "fundraising",
    meta: {
      label: "Fundraising",
      nodeName: "FundraisingEntryNode",
      parent: "fundraising-group",
    },
    create: "/fundraising/create",
    edit: "/fundraising/:id/edit",
    show: "/fundraising/:id",
    list: "/fundraising",
  },
  {
    name: "solicitationCode",
    identifier: "solicitation-code",
    meta: {
      label: "Solicitation Codes",
      parent: "fundraising-group",
      nodeName: "SolicitationCodeNode",
    },
    create: "/fundraising/solicitation-code/create",
    edit: "/fundraising/solicitation-code/:id/edit",
    show: "/fundraising/solicitation-code/:id",
    list: "/fundraising/solicitation-code",
  },
  {
    name: "ddn",
    meta: {
      label: "Uploaded DDNs",
      parent: "fundraising-group",
      nodeName: "DailyDepartmentNotificationNode",
    },
    create: "/fundraising/ddn/create",
    edit: "/fundraising/ddn/:id/edit",
    show: "/fundraising/ddn/:id",
    list: "/fundraising/ddn",
  },
  {
    name: "dbfunds",
    meta: {
      label: "DB Funds (Legacy)",
      parent: "fundraising-group",
      modelName: "FundraisingEntryNode",
    },
    create: "/fundraising/dbfunds/create",
    edit: "/fundraising/dbfunds/:id/edit",
    show: "/fundraising/dbfunds/:id",
    list: "/fundraising/dbfunds",
  },
  {
    name: "person",
    meta: {
      icon: <UserOutlined />,
      label: "People",
      modelName: "PersonNode",
    },
    create: "/people/create",
    edit: "/people/:id/edit",
    show: "/people/:id",
    list: "/people",
  },
  {
    name: "notification",
    meta: {
      icon: <BellOutlined />,
      label: "Notifications",
      modelName: "NotificationNode",
    },
    create: "/notifications/create",
    edit: "/notifications/:id/edit",
    show: "/notifications/:id",
    list: "/notifications",
  },
  {
    name: "marathon",
    meta: {
      icon: <FlagOutlined />,
      label: "Marathon",
      modelName: "MarathonNode",
    },
    create: "/marathon/create",
    edit: "/marathon/:id/edit",
    show: "/marathon/:id",
    list: "/marathon",
  },
  {
    name: "feed",
    meta: {
      icon: <ContainerOutlined />,
      label: "Feed",
      modelName: "FeedNode",
    },
    create: "/feed/create",
    edit: "/feed/:id/edit",
    show: "/feed/:id",
    list: "/feed",
  },
  {
    name: "image",
    meta: {
      icon: <FileImageOutlined />,
      label: "Images",
      modelName: "ImageNode",
    },
    create: "/images/create",
    edit: "/images/:id/edit",
    show: "/images/:id",
    list: "/images",
  },
  {
    name: "config",
    meta: {
      icon: <SettingOutlined />,
      label: "Config",
      modelName: "ConfigNode",
    },
    create: "/config/create",
    edit: "/config/:id/edit",
    show: "/config/:id",
    list: "/config",
  },
  {
    name: "log",
    meta: {
      icon: <FileTextOutlined />,
      label: "Logs",
      modelName: "LogNode",
    },
    create: "/admin/logs/create",
    edit: "/admin/logs/:id/edit",
    show: "/admin/logs/:id",
    list: "/admin/logs",
  },
] as const;

// An array of objects containing pre-split paths for refine resources as well as the index of the resource in refineResources
const resourceUrlIndex = refineResources.map((resource, index) => {
  const listUrl = resource.list?.toString().split("/").filter(Boolean);
  const createUrl = resource.create?.toString().split("/").filter(Boolean);
  const editUrl = resource.edit?.toString().split("/").filter(Boolean);
  const showUrl = resource.show?.toString().split("/").filter(Boolean);
  return {
    listUrl,
    createUrl,
    editUrl,
    showUrl,
    index,
  };
});

function check(url: string[] | undefined, urlParts: string[]) {
  return url?.every(
    (part, i) =>
      part === urlParts[i] ||
      (part.startsWith(":") && urlParts[i]?.startsWith("$"))
  );
}

/**
 * Accepts a url in the form /path/$param/path and returns the resource and action
 */
export const findResourceAction = (
  url: string
): { resource?: ResourceProps; action?: Action } => {
  const urlParts = url.split("/").filter(Boolean);
  for (const {
    listUrl,
    createUrl,
    editUrl,
    showUrl,
    index,
  } of resourceUrlIndex) {
    if (check(editUrl, urlParts)) {
      return { resource: refineResources[index], action: "edit" };
    } else if (check(showUrl, urlParts)) {
      return { resource: refineResources[index], action: "show" };
    } else if (check(createUrl, urlParts)) {
      return { resource: refineResources[index], action: "create" };
    } else if (check(listUrl, urlParts)) {
      return { resource: refineResources[index], action: "list" };
    }
  }
  return {};
};
