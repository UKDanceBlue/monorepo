import "./NavigationMenu.css";

import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useLogin, useLogout } from "@refinedev/core";
import type { Register } from "@tanstack/react-router";
import { Link, useLocation, useRouter } from "@tanstack/react-router";
import type { Authorization, AuthorizationRule } from "@ukdanceblue/common";
import {
  AccessLevel,
  checkAuthorization,
  defaultAuthorization,
} from "@ukdanceblue/common";
import { Button, Menu, Select } from "antd";
import type { ItemType } from "antd/es/menu/interface.js";
import { useContext, useEffect, useState } from "react";

import { themeConfigContext } from "#config/antThemeConfig.js";
import { marathonContext } from "#config/marathonContext.js";
import { SessionStorageKeys } from "#config/storage.js";
import { useAntFeedback } from "#hooks/useAntFeedback.js";
import {
  useAuthorizationRequirement,
  useLoginState,
} from "#hooks/useLoginState.js";

import { MasqueradeSelector } from "./MasqueradeSelector.js";

const routes: {
  path: keyof Register["router"]["routesByPath"];
  title: string;
  children?: {
    path: keyof Register["router"]["routesByPath"];
    title: string;
  }[];
}[] = [
  {
    path: "/",
    title: "Home",
  },
  {
    path: "/events",
    title: "Events",
  },
  {
    path: "/teams",
    title: "Teams",
  },
  {
    path: "/fundraising",
    title: "Fundraising",
    children: [
      {
        path: "/fundraising/ddn",
        title: "DDNs",
      },
      {
        path: "/fundraising/solicitation-code",
        title: "Solicitation Codes",
      },
      {
        path: "/fundraising/dbfunds",
        title: "DB Funds",
      },
    ],
  },
  {
    path: "/people",
    title: "People",
  },
  {
    path: "/notifications",
    title: "Notifications",
  },
  {
    path: "/marathon",
    title: "Marathon",
  },
  {
    path: "/feed",
    title: "Feed",
  },
  {
    path: "/images/$",
    title: "Images",
  },
  {
    path: "/config",
    title: "Config",
  },
  {
    path: "/admin/logs",
    title: "Logs",
  },
];

const loadingOption = [
  <Select.Option key="" value="" disabled>
    Loading...
  </Select.Option>,
];

export const NavigationMenu = () => {
  const { dark, setDark } = useContext(themeConfigContext);
  const { showErrorMessage } = useAntFeedback();

  const { authorization, loggedIn } = useLoginState();

  const canMasquerade = useAuthorizationRequirement(AccessLevel.SuperAdmin);

  const router = useRouter();
  const location = useLocation();

  const [menuItems, setMenuItems] = useState<ItemType[]>([]);
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  useEffect(() => {
    const fetchMenuItems = () => {
      const activeKeys: string[] = [];
      const filteredItems: {
        route: (typeof router)["routesByPath"][keyof (typeof router)["routesByPath"]];
        title: string;
        children: {
          route: (typeof router)["routesByPath"][keyof (typeof router)["routesByPath"]];
          title: string;
        }[];
      }[] = [];
      const matchedRoutes = new Set(
        router.matchRoutes(location).map(({ id }) => id)
      );

      for (const routeInfo of routes) {
        const route = router.routesByPath[routeInfo.path];
        const { authorizationRules } = route.options.staticData;
        const [valid, active] = shouldShowMenuItem(
          authorizationRules,
          route.id,
          matchedRoutes,
          authorization
        );
        if (valid) {
          const filteredChildren: {
            route: (typeof router)["routesByPath"][keyof (typeof router)["routesByPath"]];
            title: string;
          }[] = [];
          if (routeInfo.children) {
            for (const childInfo of routeInfo.children) {
              const childRoute = router.routesByPath[childInfo.path];
              const [childValid, childActive] = shouldShowMenuItem(
                childRoute.options.staticData.authorizationRules,
                childRoute.id,
                matchedRoutes,
                authorization
              );
              if (childValid) {
                filteredChildren.push({
                  route: childRoute,
                  title: childInfo.title,
                });
                if (childActive) {
                  activeKeys.push(childRoute.id);
                }
              }
            }
          }
          filteredItems.push({
            route,
            title: routeInfo.title,
            children: filteredChildren,
          });
          if (active) {
            activeKeys.push(route.id);
          }
        }
      }

      const updatedMenuItems = filteredItems.map(
        ({ route, title, children }): ItemType => ({
          key: route.id,
          title,
          type: children.length > 0 ? "submenu" : "item",
          label: (
            <Link
              to={route.to}
              style={{
                color: "rgba(255, 255, 255, 0.65)",
              }}
            >
              {title}
            </Link>
          ),
          children: children.map(({ route, title }) => ({
            key: route.id,
            title,
            label: (
              <Link
                style={{
                  color: "rgba(255, 255, 255, 0.65)",
                }}
                to={route.to}
              >
                {title}
              </Link>
            ),
          })),
        })
      );

      setMenuItems(updatedMenuItems);
      setActiveKeys(activeKeys);
    };

    try {
      fetchMenuItems();
    } catch (error) {
      void showErrorMessage({ content: "Failed to fetch menu items" });
      console.error("Failed to fetch menu items", error);
    }
  }, [authorization, location, router, router.routesByPath, showErrorMessage]);

  const { setMarathon, marathon, loading, marathons } =
    useContext(marathonContext);

  const { mutate: login } = useLogin();
  const { mutate: logout } = useLogout();

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={activeKeys}
      items={[
        ...menuItems,
        {
          type: "item",
          key: "login",
          style: {
            background: "transparent",
            marginLeft: "auto",
          },
          label: loggedIn ? (
            <a onClick={() => logout({})}>Logout</a>
          ) : (
            <a onClick={() => login({})}>Login</a>
          ),
        },
        {
          type: "divider",
        },
        {
          type: "item",
          key: "dark",
          title: "Dark",
          style: {
            background: "transparent",
          },
          label: (
            <Button
              icon={
                dark ? (
                  <SunOutlined style={{ color: "inherit" }} />
                ) : (
                  <MoonOutlined style={{ color: "inherit" }} />
                )
              }
              onClick={() => setDark(!dark)}
              type="text"
              style={{ color: "inherit" }}
            />
          ),
        },
        {
          type: "item",
          key: "selected-marathon",
          title: "Select Marathon",
          style: {
            background: "transparent",
          },
          label: (
            <Select
              defaultValue={""}
              onChange={(value) => setMarathon(value)}
              loading={loading}
              value={marathon?.id}
              variant="borderless"
            >
              {marathons
                ? marathons.map((marathon) => (
                    <Select.Option key={marathon.id} value={marathon.id}>
                      {marathon.year}
                    </Select.Option>
                  ))
                : loadingOption}
            </Select>
          ),
        },
        {
          type: "item",
          key: "masquerade",
          title: "Masquerade",
          style: {
            background: "transparent",
          },
          label: sessionStorage
            .getItem(SessionStorageKeys.Masquerade)
            ?.trim() ? (
            <Button
              onClick={() => {
                sessionStorage.removeItem(SessionStorageKeys.Masquerade);
                window.location.reload();
              }}
              type="text"
              style={{ color: "inherit" }}
            >
              Stop Masquerading
            </Button>
          ) : canMasquerade ? (
            <MasqueradeSelector />
          ) : null,
        },
      ]}
    />
  );
};

function shouldShowMenuItem(
  authorizationRules: AuthorizationRule[] | null,
  routeId: string,
  matchedRoutes: Set<string>,
  authorization: Authorization | undefined
): [boolean, boolean] {
  if (!authorizationRules) {
    return [true, matchedRoutes.has(routeId)];
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
    return [isAuthorized, matchedRoutes.has(routeId)];
  }
}
