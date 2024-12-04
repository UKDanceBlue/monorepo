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
import type { Register } from "@tanstack/react-router";
import type { Authorization, AuthorizationRule } from "@ukdanceblue/common";
import { checkAuthorization, defaultAuthorization } from "@ukdanceblue/common";
import type { FileRoutesByFullPath } from "routeTree.gen";

import { useLoginState } from "#hooks/useLoginState.ts";

function shouldShowMenuItem(
  authorizationRules: AuthorizationRule[] | null,
  authorization: Authorization | undefined
): boolean {
  if (!authorizationRules) {
    return true;
  } else {
    let isAuthorized = false;
    for (const authorizationRule of authorizationRules) {
      if (
        checkAuthorization(
          authorizationRule,
          authorization ?? defaultAuthorization
        )
      ) {
        isAuthorized = true;
        break;
      }
    }
    return isAuthorized;
  }
}

export function useRefineResources({ router }: { router: Register["router"] }) {
  const { authorization } = useLoginState();

  const refineResources: ResourceProps[] = [
    {
      name: "event",
      meta: {
        icon: <CalendarOutlined />,
        label: "Events",
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
      },
      create: "/admin/logs/create",
      edit: "/admin/logs/:id/edit",
      show: "/admin/logs/:id",
      list: "/admin/logs",
    },
  ];

  for (const resource of refineResources) {
    const route = router.routesByPath[
      String(resource.list) as keyof FileRoutesByFullPath
    ] as (typeof router)["routesByPath"]["/"] | undefined;
    if (!route) {
      continue;
    }

    const { authorizationRules } = route.options.staticData;
    resource.meta = {
      ...resource.meta,
      hide: !shouldShowMenuItem(authorizationRules, authorization),
    };
  }

  return refineResources;
}
