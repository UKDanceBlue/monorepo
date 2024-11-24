import "./RibbonSpinner.css";

import Ribbon from "#assets/ribbon.svg";

export function SpinningRibbon({ size }: { size: string | number }) {
  return (
    <div className="flip">
      <img
        src={Ribbon}
        alt="Loading..."
        style={{ width: size, height: size }}
      />
    </div>
  );
}
