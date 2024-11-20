import { VegaLite } from "react-vega";
import { createPlot } from "./vega-utils";

export function VegaPlot() {
  const spec = createPlot({});
  return <VegaLite spec={spec} />;
}
