import type { TextProps as RNETextProps } from "@rneui/themed";
import { Text as RNEText } from "@rneui/themed";
import { makeStyles } from "@rneui/themed";

export interface TextProps extends RNETextProps {
  italic?: boolean;
  bold?: boolean;
}

const useStyles = makeStyles((_, props: TextProps) => {
  const heading = props.h1 || props.h2 || props.h3 || props.h4;
  let fontFamily: string;
  if (heading) {
    if (props.bold && props.italic) {
      fontFamily = "bodoni-flf-bold-italic serif";
    } else if (props.bold) {
      fontFamily = "bodoni-flf-bold serif";
    } else if (props.italic) {
      fontFamily = "bodoni-flf-italic serif";
    } else {
      fontFamily = "bodoni-flf-roman serif";
    }
  } else if (props.bold) {
    fontFamily = "opensans-condensed-bold sans-serif";
  } else if (props.italic) {
    fontFamily = "opensans-condensed-light-italic sans-serif";
  } else {
    fontFamily = "opensans-condensed-light sans-serif";
  }

  return {
    base: {
      fontFamily,
      fontWeight: props.bold ? "bold" : "normal",
      fontStyle: props.italic ? "italic" : "normal",
    },
  };
});

export function Text(props: TextProps) {
  const styles = useStyles(props);
  return <RNEText {...props} style={[styles.base, props.style]} />;
}
