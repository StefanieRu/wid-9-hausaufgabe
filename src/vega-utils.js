// vega-utils.js
import datasets from "vega-datasets";
import * as vl from "vega-lite-api";

const data = await datasets["seattle-weather.csv"]();

export function createPlot({ width = 600 }) {
  const brush = vl.selectInterval().encodings("x");
  const click = vl.selectMulti().encodings("color");

  const scale = {
    domain: ["sun", "fog", "drizzle", "rain", "snow"],
    range: ["#e7ba52", "#a7a7a7", "#aec7e8", "#1f77b4", "#9467bd"],
  };

  const points = vl
    .markPoint({ filled: false })
    .encode(
      vl
        .color()
        .value("lightgray")
        .if(brush, vl.color().fieldN("weather").scale(scale).title("Weather")),
      vl
        .size()
        .fieldQ("precipitation")
        .scale({ domain: [-1, 50], range: [10, 500] })
        .title("Precipitation"),
      vl.order().fieldQ("precipitation").sort("descending"),
      vl.x().timeMD("date").axis({ title: "Date", format: "%b" }),
      vl
        .y()
        .fieldQ("temp_max")
        .scale({ domain: [-5, 40] })
        .axis({ title: "Maximum Daily Temperature (°C)" })
    )
    .width(width)
    .height(300)
    .select(brush)
    .transform(vl.filter(click));

  const bars = vl
    .markBar()
    .encode(
      vl
        .color()
        .value("lightgray")
        .if(click, vl.color().fieldN("weather").scale(scale).title("Weather")),
      vl.x().count(),
      vl.y().fieldN("weather").scale({ domain: scale.domain }).title("Weather")
    )
    .width(width)
    .select(click)
    .transform(vl.filter(brush));

  const plot = vl
    .vconcat(points, bars)
    .data(data)
    .autosize({ type: "fit-x", contains: "padding" });

  return plot.toSpec();
}
