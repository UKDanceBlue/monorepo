import "./NavigationMenu.css";

import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { themeConfigContext } from "@config/antThemeConfig";
import { API_BASE_URL } from "@config/api";
import { marathonContext } from "@config/marathonContext";
import { SessionStorageKeys } from "@config/storage";
import { useAntFeedback } from "@hooks/useAntFeedback";
import {
  useAuthorizationRequirement,
  useLoginState,
} from "@hooks/useLoginState";
import type { Register } from "@tanstack/react-router";
import { Link, useLocation, useRouter } from "@tanstack/react-router";
import {
  AccessLevel,
  checkAuthorization,
  defaultAuthorization,
} from "@ukdanceblue/common";
import { Button, Menu, Select } from "antd";
import { useContext, useEffect, useState } from "react";

import { MasqueradeSelector } from "./MasqueradeSelector";

const routes: {
  path: keyof Register["router"]["routesByPath"];
  title: string;
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
    path: "/dbfunds",
    title: "DB Funds",
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

  const [menuItems, setMenuItems] = useState<
    {
      key: string;
      title: string;
      label: JSX.Element;
    }[]
  >([]);
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  useEffect(() => {
    const fetchMenuItems = () => {
      const activeKeys: string[] = [];
      const filteredItems: {
        route: (typeof router)["routesByPath"][keyof (typeof router)["routesByPath"]];
        title: string;
      }[] = [];
      const matchedRoutes = new Set(
        router.matchRoutes(location).map(({ id }) => id)
      );

      for (const routeInfo of routes) {
        const route = router.routesByPath[routeInfo.path];
        const { authorizationRules } = route.options.staticData;
        if (!authorizationRules) {
          filteredItems.push({ route, title: routeInfo.title });
          if (matchedRoutes.has(route.id)) {
            activeKeys.push(route.id);
          }
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
          if (isAuthorized) {
            filteredItems.push({ route, title: routeInfo.title });
            if (matchedRoutes.has(route.id)) {
              activeKeys.push(route.id);
            }
          }
        }
      }

      const updatedMenuItems = filteredItems.map(({ route, title }) => ({
        key: route.id,
        title,
        label: <Link to={route.to}>{title}</Link>,
      }));

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
            <a
              href={`${API_BASE_URL}/api/auth/logout?redirectTo=${encodeURI(
                window.location.href
              )}`}
            >
              Logout
            </a>
          ) : (
            <a
              href={`${API_BASE_URL}/api/auth/login?returning=cookie&redirectTo=${encodeURI(
                window.location.href
              )}`}
            >
              Login
            </a>
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
