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
  return (
    <G transform={`rotate(${rotateBy} ${centerPoint.x} ${centerPoint.y})`}>
      <Path
        d={`M ${centerPoint.x} ${centerPoint.y} L ${centerPoint.x} ${
          centerPoint.y - radius
        } A ${radius} ${radius} 0 0 1 ${
          centerPoint.x + radius * Math.sin((angle * Math.PI) / 180)
        } ${centerPoint.y - radius * Math.cos((angle * Math.PI) / 180)} Z`}
        fill="white"
        stroke="black"
      />
      <Text
        x={centerPoint.x}
        y={centerPoint.y - radius / 2}
        textAnchor="middle"
        alignmentBaseline="middle"
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
export default function Pinwheel<Values>({
  positions,
  getPosition: _getPosition,
}: {
  positions: PinwheelPosition<Values>[];
  getPosition: (value: Values[]) => number;
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
