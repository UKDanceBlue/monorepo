import { LoadingOutlined } from "@ant-design/icons";
import { API_BASE_URL } from "@config/api";
import { useLoginState } from "@hooks/useLoginState";
import type { AuthorizationRule } from "@ukdanceblue/common";
import { AccessLevel, checkAuthorization } from "@ukdanceblue/common";
import { Menu } from "antd";
import type { ItemType } from "antd/es/menu/hooks/useItems";
import { useMemo } from "react";

interface NavItemType {
  slug: string;
  title: string;
  url?: string;
  element?: React.ReactNode;
  authorizationRules?: AuthorizationRule[];
}

export const NavigationMenu = () => {
  const { loggedIn, authorization } = useLoginState();
  const navItems = useMemo((): NavItemType[] => {
    return [
      {
        slug: "home",
        title: "Home",
        url: "/",
      },
      {
        slug: "events",
        title: "Events",
        authorizationRules: [
          {
            accessLevel: AccessLevel.CommitteeChairOrCoordinator,
          },
        ],
      },
      {
        slug: "teams",
        title: "Teams",
        authorizationRules: [
          {
            accessLevel: AccessLevel.CommitteeChairOrCoordinator,
          },
        ],
      },
      {
        slug: "people",
        title: "People",
        authorizationRules: [
          {
            accessLevel: AccessLevel.CommitteeChairOrCoordinator,
          },
        ],
      },
      {
        slug: "config",
        title: "Config",
        authorizationRules: [
          {
            accessLevel: AccessLevel.Admin,
          },
        ],
      },
    ];
  }, []);

  const menuItems = useMemo<ItemType[]>((): ItemType[] => {
    return navItems
      .filter(
        ({ authorizationRules }) =>
          !authorizationRules ||
          (authorization &&
            authorizationRules.some((authorizationRule) =>
              checkAuthorization(authorizationRule, authorization)
            ))
      )
      .map((item) => ({
        key: item.slug,
        title: item.title,
        label: (
          <a href={item.url ?? `/${item.slug}`}>{item.element ?? item.title}</a>
        ),
      }));
  }, [authorization, navItems]);

  const activeKeys = useMemo<string[]>((): string[] => {
    const { pathname } = window.location;
    const activeKeys: string[] = [];
    for (const item of navItems) {
      if (item.url != null && pathname === item.url) {
        activeKeys.push(item.slug);
      } else if (item.slug === pathname.slice(1)) {
        activeKeys.push(item.slug);
      }
    }
    return activeKeys;
  }, [navItems]);

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={activeKeys}
      items={[
        ...menuItems,
        {
          type: "divider",
        },
        {
          key: "login",
          title: "Login",
          icon: loggedIn == null ? <LoadingOutlined /> : undefined,
          disabled: loggedIn == null,
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
      ]}
    />
  );
};
