import { Menu } from "antd";
import type { ItemType } from "antd/es/menu/hooks/useItems";
import { useMemo } from "react";

interface NavItemType {
  slug: string;
  title: string;
  url?: string;
  element?: React.ReactNode;
}

export const NavigationMenu = () => {
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
      },
    ];
  }, []);

  const menuItems = useMemo<ItemType[]>((): ItemType[] => {
    return navItems.map((item) => ({
      key: item.slug,
      title: item.title,
      label: (
        <a href={item.url ?? `/${item.slug}`}>{item.element ?? item.title}</a>
      ),
    }));
  }, [navItems]);

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
      items={menuItems}
    />
  );
};
