export function Text({
  props,
  children,
}: {
  props?: Omit<React.HTMLProps<HTMLParagraphElement>, "children">;
  children: React.ReactNode;
}) {
  return (
    <p
      {...props}
      className={"font-sans" + (props?.className ? " " + props.className : "")}
    >
      {children}
    </p>
  );
}
