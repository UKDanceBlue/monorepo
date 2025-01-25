import {
  BarsOutlined,
  LogoutOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  type RefineLayoutSiderProps,
  Title as DefaultTitle,
} from "@refinedev/antd";
import {
  useIsExistAuthentication,
  useLink,
  useLogout,
  useMenu,
  useTitle,
  useTranslate,
  useWarnAboutChange,
} from "@refinedev/core";
import {
  Button,
  ConfigProvider,
  Drawer,
  Grid,
  Layout,
  Menu,
  Typography,
} from "antd";
import type { ItemType } from "antd/es/menu/interface";
import React, { useContext, useMemo, useState } from "react";

import { marathonContext } from "#config/marathonContext.ts";
import { canSync } from "#config/refine/authorization.ts";
import { StorageManager, useStorageValue } from "#config/storage.ts";
import { useLoginState } from "#hooks/useLoginState.ts";

import { drawerButtonStyles } from "./styles";

export const Sider: React.FC<
  RefineLayoutSiderProps & {
    getItems?: (props: {
      items: ItemType[];
      logout: ItemType | false;
      collapsed: boolean;
    }) => ItemType[];
  }
> = ({ Title: TitleFromProps, getItems, meta }) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [menuCollapsed, setMenuCollapsed] = useStorageValue(
    StorageManager.Local,
    StorageManager.keys.collapseSidebar,
    "true"
  );

  const isExistAuthentication = useIsExistAuthentication();
  const Link = useLink();
  const { warnWhen, setWarnWhen } = useWarnAboutChange();
  const TitleFromContext = useTitle();
  const translate = useTranslate();
  const { menuItems, selectedKey, defaultOpenKeys } = useMenu({ meta });
  const breakpoint = Grid.useBreakpoint();
  const { mutate: mutateLogout } = useLogout();
  const loginState = useLoginState();

  const isMobile = breakpoint.lg === undefined ? false : !breakpoint.lg;

  const RenderToTitle = TitleFromProps ?? TitleFromContext ?? DefaultTitle;

  const items = useMemo((): ItemType[] => {
    function makeItem(
      treeItem: (typeof menuItems)[number]
    ): ItemType | undefined {
      const { key, name, children, meta, list } = treeItem;

      const visible = canSync(
        {
          action: "read",
          params: {
            resource: treeItem,
          },
          resource: name,
        },
        loginState
      );

      if (!visible.can) {
        return;
      }

      if (children.length > 0) {
        return {
          key,
          icon: meta?.icon ?? <UnorderedListOutlined />,
          type: "submenu",
          label: meta?.label,
          children: makeChildren(children),
        };
      }

      const isSelected = key === selectedKey;
      const isRoute = !(meta?.parent !== undefined && children.length === 0);
      return {
        key,
        icon: meta?.icon ?? (isRoute && <UnorderedListOutlined />),
        style: {
          fontWeight: isSelected ? "bold" : "normal",
        },
        label: (
          <>
            <Link to={String(list ?? "")}>{meta?.label}</Link>
            {!menuCollapsed && isSelected && (
              <div className="ant-menu-tree-arrow" />
            )}
          </>
        ),
      };
    }

    function makeChildren(tree: typeof menuItems): ItemType[] {
      const menuTree: ItemType[] = [];
      for (const item of tree.sort(
        (a, b) => (a.meta?.menuWeight ?? 0) - (b.meta?.menuWeight ?? 0)
      )) {
        const menuItem = makeItem(item);
        if (menuItem) {
          menuTree.push(menuItem);
        }
      }
      return menuTree;
    }

    return makeChildren(menuItems);
  }, [Link, loginState, menuCollapsed, menuItems, selectedKey]);

  const siderItems = useMemo((): ItemType[] => {
    const handleLogout = () => {
      if (warnWhen) {
        const confirm = window.confirm(
          translate(
            "warnWhenUnsavedChanges",
            "Are you sure you want to leave? You have unsaved changes."
          )
        );

        if (confirm) {
          setWarnWhen(false);
          mutateLogout();
        }
      } else {
        mutateLogout();
      }
    };

    const logout: ItemType | false = isExistAuthentication && {
      key: "logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      label: translate("buttons.logout", "Logout"),
    };

    if (getItems) {
      return getItems({
        items,
        logout,
        collapsed: menuCollapsed === "true",
      });
    }

    const itemList: ItemType[] = [...items];
    if (logout) {
      itemList.push(logout);
    }
    return itemList;
  }, [
    getItems,
    isExistAuthentication,
    items,
    menuCollapsed,
    mutateLogout,
    setWarnWhen,
    translate,
    warnWhen,
  ]);

  const renderMenu = () => {
    return (
      <>
        <Menu
          theme="dark"
          selectedKeys={selectedKey ? [selectedKey] : []}
          defaultOpenKeys={defaultOpenKeys}
          mode="inline"
          onClick={() => {
            setDrawerOpen(false);
            if (!breakpoint.lg) {
              setMenuCollapsed("true");
            }
          }}
          items={siderItems}
        />
      </>
    );
  };

  const { marathon, source } = useContext(marathonContext);

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemBg: "transparent",
            itemColor: "#fff",
            itemSelectedColor: "#fff",
            itemSelectedBg: "transparent",
            itemHoverColor: "#fff",
          },
        },
      }}
    >
      {isMobile ? (
        <>
          <Drawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            placement="left"
            closable={false}
            width={200}
            styles={{
              body: {
                padding: 0,
              },
            }}
            maskClosable={true}
          >
            <Layout>
              <Layout.Sider
                style={{
                  height: "100vh",
                  overflow: "auto",
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(2555,255,255,0.65) #0000",
                }}
              >
                <RenderToTitle collapsed={false} />
                {source === "selected" && (
                  <Typography.Text
                    style={{
                      color: "#ddd",
                      textAlign: "center",
                      width: "100%",
                      display: "inline-block",
                    }}
                  >
                    Viewing {marathon?.year}
                  </Typography.Text>
                )}
                {renderMenu()}
              </Layout.Sider>
            </Layout>
          </Drawer>
          <Button
            style={drawerButtonStyles}
            size="large"
            onClick={() => setDrawerOpen(true)}
            icon={<BarsOutlined />}
          />
        </>
      ) : (
        <Layout.Sider
          style={{
            overflow: "auto",
            height: "100vh",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(2555,255,255,0.65) #0000",
          }}
          collapsible
          collapsed={menuCollapsed === "true"}
          onCollapse={(collapsed: boolean): void =>
            setMenuCollapsed(collapsed ? "true" : "false")
          }
          collapsedWidth={80}
          breakpoint="lg"
        >
          <RenderToTitle collapsed={menuCollapsed === "true"} />
          {source === "selected" && (
            <Typography.Text
              style={{
                color: "#ddd",
                textAlign: "center",
                width: "100%",
                display: "inline-block",
              }}
            >
              Viewing {marathon?.year}
            </Typography.Text>
          )}
          {renderMenu()}
        </Layout.Sider>
      )}
    </ConfigProvider>
  );
};
