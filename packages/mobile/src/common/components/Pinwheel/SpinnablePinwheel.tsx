import { TouchableOpacity } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import type { PinwheelPosition } from "./Pinwheel";
import Pinwheel from "./Pinwheel";

// Speed in degrees per ms
const SPIN_SPEED = 0.5;

function SpinnablePinwheel<Values>({
  positions,
  getPosition,
  afterSpin,
}: {
  positions: PinwheelPosition<Values>[];
  getPosition: (positions: PinwheelPosition<Values>[]) => number;
  afterSpin?: (position: PinwheelPosition<Values>) => void;
}) {
  const spinValue = useSharedValue(0);

  const spin = () => {
    const segmentAngle = 360 / positions.length;
    const selectedPosition = getPosition(positions);
    // We need to go an extra 0.5 segments to make sure the pinwheel stops at the right position
    const targetPosition = selectedPosition * segmentAngle - segmentAngle / 2;

    const spinMagnitude = Math.floor(Math.random() * 4) + 2;
    const vanitySpin = 360 * spinMagnitude;

    // spinValue.value = withTiming(targetSpin, {
    //   duration: spinDuration,
    //   easing: Easing.out(Easing.bezierFn(0, 0.09, 0.41, -0.46)),
    // });

    const finalPosition = vanitySpin - targetPosition;
    const spinDuration = Math.abs(finalPosition - spinValue.value) / SPIN_SPEED;

    spinValue.value = withTiming(
      finalPosition,
      {
        duration: spinDuration,
        easing: Easing.bezierFn(0.14, -0.29, 0, 1.27),
      },
      () => {
        if (afterSpin) runOnJS(afterSpin)(positions[selectedPosition]);
      }
    );
  };

  return (
    <Animated.View
      style={{
        transform: useDerivedValue(() => [{ rotate: `${spinValue.value}deg` }]),
      }}
    >
      <TouchableOpacity onPress={spin}>
        <Pinwheel positions={positions} />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default SpinnablePinwheel;
