import { G, Path, Svg, Text } from "react-native-svg";

export interface PinwheelPosition<Value> {
  text: string;
  value: Value;
}

interface Coordinate {
  x: number;
  y: number;
}

/**
 * Component for a segment of a pinwheel
 *
 * Draws a segment of a circle with text in the middle, rotated so that it can be displayed in a pinwheel
 *
 * The text needs to be pointing out from the center of the pinwheel
 *
 * @param text - The text to display on the segment
 * @param centerPoint - The center point of the pinwheel
 * @param radius - The radius of the pinwheel
 * @param angle - How many degrees around the pinwheel the segment is
 * @param rotateBy - How many degrees to rotate the entire component by (about the center point)
 * @returns The component for the segment
 */
const PinwheelSegment = ({
  text,
  centerPoint,
  radius,
  angle,
  rotateBy,
}: {
  text: string;
  centerPoint: Coordinate;
  radius: number;
  angle: number;
  rotateBy: number;
}) => {
  const arcCoordinateA = {
    x: centerPoint.x,
    y: centerPoint.y - radius,
  };
  const arcCoordinateMid = {
    x: centerPoint.x + radius * Math.sin(((angle / 2) * Math.PI) / 180),
    y: centerPoint.y - radius * Math.cos(((angle / 2) * Math.PI) / 180),
  };
  const arcCoordinateB = {
    x: centerPoint.x + radius * Math.sin((angle * Math.PI) / 180),
    y: centerPoint.y - radius * Math.cos((angle * Math.PI) / 180),
  };

  if (
    [arcCoordinateA, arcCoordinateMid, arcCoordinateB].some((coord) => {
      return Number.isNaN(coord.x) || Number.isNaN(coord.y);
    })
  ) {
    throw new Error(
      "Invalid coordinates calculated for pinwheel spinner, this is a bug!"
    );
  }

  // Rotate the entire thing by rotateBy about the center point
  const groupTransform = `rotate(${rotateBy} ${centerPoint.x} ${centerPoint.y})`;
  // Rotate the content so that it is in line with the segment
  const contentTransform = `rotate(${-angle} ${arcCoordinateMid.x} ${
    arcCoordinateMid.y
  })`;

  return (
    <G transform={groupTransform}>
      <Path
        d={
          // Move the "stylus" to the center
          `M ${centerPoint.x} ${centerPoint.y} ` +
          // Draw a line to arc coordinate A
          `L ${arcCoordinateA.x} ${arcCoordinateA.y} ` +
          // Draw an arc to arc coordinate B and go back to the start (with Z)
          `A ${radius} ${radius} 0 0 1 ${arcCoordinateB.x} ${arcCoordinateB.y} Z`
        }
        fill="white"
        stroke="black"
      />
      <Text
        x={arcCoordinateMid.x}
        y={arcCoordinateMid.y}
        textAnchor="end"
        alignmentBaseline="middle"
        transform={contentTransform}
      >
        {text}
      </Text>
    </G>
  );
};

/**
 * Component for a pinwheel
 * @param positions - The positions of the pinwheel
 * @param getPosition - When spun this function is called to decide where the pinwheel stops, returning the index of the position
 */
function Pinwheel<Values>({
  positions,
}: {
  positions: PinwheelPosition<Values>[];
}) {
  return (
    <Svg height="100%" width="100%" viewBox="0 0 100 100">
      {positions.map((position, index) => {
        return (
          <PinwheelSegment
            key={index}
            text={position.text}
            centerPoint={{ x: 50, y: 50 }}
            radius={50}
            angle={360 / positions.length}
            rotateBy={(360 / positions.length) * index}
          />
        );
      })}
    </Svg>
  );
}

export default Pinwheel;
