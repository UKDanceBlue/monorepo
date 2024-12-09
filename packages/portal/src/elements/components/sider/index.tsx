import {
  BarsOutlined,
  DashboardOutlined,
  LogoutOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  type RefineLayoutSiderProps,
  Title as DefaultTitle,
} from "@refinedev/antd";
import {
  CanAccess,
  type ITreeMenu,
  pickNotDeprecated,
  useActiveAuthProvider,
  useIsExistAuthentication,
  useLink,
  useLogout,
  useMenu,
  useRefineContext,
  useRouterContext,
  useRouterType,
  useTitle,
  useTranslate,
  useWarnAboutChange,
} from "@refinedev/core";
import { Button, ConfigProvider, Drawer, Grid, Layout, Menu } from "antd";
import React, { useState } from "react";

import { drawerButtonStyles } from "./styles";

export const Sider: React.FC<
  RefineLayoutSiderProps & {
    collapsed?: boolean;
    setCollapsed?: (collapsed: boolean) => void;
  }
> = ({
  Title: TitleFromProps,
  render,
  meta,
  collapsed = false,
  setCollapsed = () => undefined,
}) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const isExistAuthentication = useIsExistAuthentication();
  const routerType = useRouterType();
  const NewLink = useLink();
  const { warnWhen, setWarnWhen } = useWarnAboutChange();
  const { Link: LegacyLink } = useRouterContext();
  const Link = routerType === "legacy" ? LegacyLink : NewLink;
  const TitleFromContext = useTitle();
  const translate = useTranslate();
  const { menuItems, selectedKey, defaultOpenKeys } = useMenu({ meta });
  const breakpoint = Grid.useBreakpoint();
  const { hasDashboard } = useRefineContext();
  const authProvider = useActiveAuthProvider();
  const { mutate: mutateLogout } = useLogout({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const isMobile = breakpoint.lg === undefined ? false : !breakpoint.lg;

  const RenderToTitle = TitleFromProps ?? TitleFromContext ?? DefaultTitle;

  const renderTreeView = (tree: ITreeMenu[], selectedKey?: string) => {
    return tree.map((item: ITreeMenu) => {
      const {
        icon,
        label,
        route,
        key,
        name,
        children,
        parentName,
        meta,
        options,
      } = item;

      if (children.length > 0) {
        return (
          <CanAccess
            key={key}
            resource={name}
            action="list"
            params={{
              resource: item,
            }}
          >
            <Menu.SubMenu
              key={key}
              icon={icon ?? <UnorderedListOutlined />}
              title={label}
            >
              {renderTreeView(children, selectedKey)}
            </Menu.SubMenu>
          </CanAccess>
        );
      }
      const isSelected = key === selectedKey;
      const isRoute = !(
        pickNotDeprecated(meta?.parent, options?.parent, parentName) !==
          undefined && children.length === 0
      );
      return (
        <CanAccess
          key={key}
          resource={name}
          action="list"
          params={{
            resource: item,
          }}
        >
          <Menu.Item
            key={key}
            style={{
              fontWeight: isSelected ? "bold" : "normal",
            }}
            icon={icon ?? (isRoute && <UnorderedListOutlined />)}
          >
            <Link to={route ?? ""}>{label}</Link>
            {!collapsed && isSelected && (
              <div className="ant-menu-tree-arrow" />
            )}
          </Menu.Item>
        </CanAccess>
      );
    });
  };

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

  const logout = isExistAuthentication && (
    <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
      {translate("buttons.logout", "Logout")}
    </Menu.Item>
  );

  const dashboard = hasDashboard ? (
    <Menu.Item
      key="dashboard"
      style={{
        fontWeight: selectedKey === "/" ? "bold" : "normal",
      }}
      icon={<DashboardOutlined />}
    >
      <Link to="/">{translate("dashboard.title", "Dashboard")}</Link>
      {!collapsed && selectedKey === "/" && (
        <div className="ant-menu-tree-arrow" />
      )}
    </Menu.Item>
  ) : null;

  const items = renderTreeView(menuItems, selectedKey);

  const renderSider = () => {
    if (render) {
      return render({
        dashboard,
        items,
        logout,
        collapsed,
      });
    }
    return (
      <>
        {dashboard}
        {items}
        {logout}
      </>
    );
  };

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
              setCollapsed(true);
            }
          }}
        >
          {renderSider()}
        </Menu>
      </>
    );
  };

  const renderDrawerSider = () => {
    return (
      <>
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          placement="left"
          closable={false}
          width={200}
          bodyStyle={{
            padding: 0,
          }}
          maskClosable={true}
        >
          <Layout>
            <Layout.Sider style={{ height: "100vh", overflow: "auto" }}>
              <RenderToTitle collapsed={false} />
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
    );
  };

  const renderContent = () => {
    if (isMobile) {
      return renderDrawerSider();
    }

    return (
      <Layout.Sider
        style={{
          overflow: "auto",
          height: "100vh",
          left: 0,
        }}
        collapsible
        collapsed={collapsed}
        onCollapse={(collapsed: boolean): void => setCollapsed(collapsed)}
        collapsedWidth={80}
        breakpoint="lg"
      >
        <RenderToTitle collapsed={collapsed} />
        {renderMenu()}
      </Layout.Sider>
    );
  };

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
      {renderContent()}
    </ConfigProvider>
  );
};
