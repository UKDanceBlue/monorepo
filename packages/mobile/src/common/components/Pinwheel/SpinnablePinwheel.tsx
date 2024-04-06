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
  cooldown,
}: {
  positions: PinwheelPosition<Values>[];
  getPosition: (positions: PinwheelPosition<Values>[]) => number;
  afterSpin?: (position: PinwheelPosition<Values>) => void;
  cooldown?: number;
}) {
  const spinValue = useSharedValue(0);
  const disabled = useSharedValue(false);

  const spin = () => {
    const segmentAngle = 360 / positions.length;
    const selectedPosition = getPosition(positions);
    const targetPosition = selectedPosition * segmentAngle - segmentAngle;

    const spinMagnitude = Math.floor(Math.random() * 4) + 2;
    const vanitySpin = 360 * spinMagnitude;

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

    disabled.value = with
  };

  return (
    <Animated.View
      style={{
        transform: useDerivedValue(() => [{ rotate: `${spinValue.value}deg` }]),
      }}
    >
      <TouchableOpacity onPress={spin} disabled={disabled}>
        <Pinwheel positions={positions} />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default SpinnablePinwheel;
