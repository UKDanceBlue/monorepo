import { Menu } from "antd";

export const NavigationMenu = () => {
  return (
    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={["2"]}
      items={new Array(15).fill(null).map((_, index) => {
        const key = index + 1;
        return {
          key,
          label: `nav ${key}`,
        };
      })}
    />
  );
};
