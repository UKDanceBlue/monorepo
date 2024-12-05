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
import type { ResourceProps } from "@refinedev/core";

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
    name: "fundraising",
    meta: {
      icon: <DollarCircleOutlined />,
      label: "Fundraising",
      nodeName: "FundraisingEntryNode",
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
      parent: "fundraising",
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
      parent: "fundraising",
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
      parent: "fundraising",
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
];

export function useRefineResources() {
  // const { authorization } = useLoginState();

  // for (const resource of refineResources) {
  //   const route = router.routesByPath[
  //     String(resource.list) as keyof FileRoutesByFullPath
  //   ] as (typeof router)["routesByPath"]["/"] | undefined;
  //   if (!route) {
  //     continue;
  //   }

  //   const { authorizationRules } = route.options.staticData;
  //   resource.meta = {
  //     ...resource.meta,
  //     hide: !shouldShowMenuItem(authorizationRules, authorization),
  //   };
  // }

  return refineResources;
}
