import {
  BellOutlined,
  CalendarOutlined,
  ContainerOutlined,
  DollarCircleOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FlagOutlined,
  MobileOutlined,
  TeamOutlined,
  ToolOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { Action, ResourceProps } from "@refinedev/core";
import type { GlobalId, Subject } from "@ukdanceblue/common";
import { parseGlobalId, serializeGlobalId } from "@ukdanceblue/common";

export const refineResources = [
  {
    name: "team",
    meta: {
      icon: <TeamOutlined />,
      label: "Teams",
      modelName: "TeamNode",
      canDelete: true,
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
      modelName: "FundraisingEntryNode",
    },
  },
  {
    name: "solicitationCode",
    identifier: "solicitation-code",
    meta: {
      label: "Solicitation Codes",
      parent: "fundraising-group",
      modelName: "SolicitationCodeNode",
      menuWeight: 2,
    },
    create: "/fundraising/solicitation-code/create",
    edit: "/fundraising/solicitation-code/:id/edit",
    show: "/fundraising/solicitation-code/:id",
    list: "/fundraising/solicitation-code",
  },
  {
    name: "dailyDepartmentNotification",
    meta: {
      label: "Uploaded DDNs",
      parent: "fundraising-group",
      modelName: "DailyDepartmentNotificationNode",
      menuWeight: 3,
    },
    create: "/fundraising/ddn/create",
    edit: "/fundraising/ddn/:id/edit",
    show: "/fundraising/ddn/:id",
    list: "/fundraising/ddn",
  },
  {
    name: "fundraisingEntry",
    meta: {
      label: "Entries",
      modelName: "FundraisingEntryNode",
      parent: "fundraising-group",
      menuWeight: 1,
    },
    create: "/fundraising/create",
    edit: "/fundraising/:id/edit",
    show: "/fundraising/:id/edit",
    list: "/fundraising",
  },
  {
    name: "person",
    meta: {
      icon: <UserOutlined />,
      label: "People",
      modelName: "PersonNode",
      canDelete: true,
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
      canDelete: true,
    },
    create: "/notifications/create",
    edit: "/notifications/:id/manage",
    show: "/notifications/:id",
    list: "/notifications",
  },
  {
    name: "notificationDeliveries",
    meta: {
      parent: "notification",
      hide: true,
      modelName: "NotificationDeliveryNode",
    },
    list: "/notifications/:notificationId",
  },
  {
    name: "event",
    meta: {
      icon: <CalendarOutlined />,
      label: "Events",
      modelName: "EventNode",
      canDelete: true,
    },
    create: "/events/create",
    edit: "/events/:id/edit",
    show: "/events/:id",
    list: "/events",
  },
  {
    name: "feed",
    meta: {
      icon: <ContainerOutlined />,
      label: "Feed",
      modelName: "FeedNode",
      canDelete: true,
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
      canDelete: true,
    },
    create: "/images/create",
    edit: "/images/:id/edit",
    show: "/images/:id",
    list: "/images",
  },
  {
    name: "marathon",
    meta: {
      icon: <FlagOutlined />,
      label: "Marathon",
      modelName: "MarathonNode",
      canDelete: true,
    },
    create: "/marathon/create",
    edit: "/marathon/:id/edit",
    show: "/marathon/:id",
    list: "/marathon",
  },
  {
    name: "config",
    meta: {
      icon: <ToolOutlined />,
      label: "Config",
      modelName: "ConfigurationNode",
    },
    create: "/config/create",
    edit: "/config/:id/edit",
    show: "/config/:id",
    list: "/config",
  },
  {
    name: "device",
    meta: {
      icon: <MobileOutlined />,
      label: "Devices",
      modelName: "DeviceNode",
    },
    create: "/devices/create",
    edit: "/devices/:id/edit",
    show: "/devices/:id",
    list: "/devices",
  },
  {
    name: "auditLog",
    meta: {
      icon: <FileTextOutlined />,
      label: "Logs",
      modelName: "AuditLogNode",
    },
    create: "/admin/logs/create",
    edit: "/admin/logs/:id/edit",
    show: "/admin/logs/:id",
    list: "/admin/logs",
  },
] as const satisfies (ResourceProps & {
  meta: {
    modelName: Subject;
  };
})[];

export type RefineResourceName = (typeof refineResources)[number]["name"];
export const refineResourceNames = {} as { [K in RefineResourceName]: K };
for (const { name } of refineResources) {
  // @ts-expect-error Don't worry about it
  refineResourceNames[name] = name;
}

export function findResourceByGlobalId(
  globalId: string | GlobalId
): (typeof refineResources)[number] | undefined {
  let typename: string;
  if (typeof globalId === "string") {
    const parsed = parseGlobalId(globalId);
    if (parsed.isErr()) {
      return undefined;
    }
    typename = parsed.value.typename;
  } else {
    typename = globalId.typename;
  }

  for (const resource of refineResources.toReversed()) {
    if (resource.name === typename || resource.meta.modelName === typename) {
      return resource;
    }
  }

  return undefined;
}

export function findViewLinkByGlobalId(
  globalId: string | GlobalId
): string | undefined {
  const resource = findResourceByGlobalId(globalId);
  console.log(resource);
  if (!resource || !("show" in resource)) {
    return undefined;
  }

  return `${window.location.protocol}//${
    window.location.host
  }${resource.show.replace(
    ":id",
    typeof globalId === "string" ? globalId : serializeGlobalId(globalId)
  )}`;
}

// An array of objects containing pre-split paths for refine resources as well as the index of the resource in refineResources
const resourceUrlIndex = refineResources.map(
  (resource: ResourceProps, index) => {
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
  }
);

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
  pathname: string
): { resource?: ResourceProps; action?: Action } => {
  const urlParts = pathname.split("/").filter(Boolean);
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
