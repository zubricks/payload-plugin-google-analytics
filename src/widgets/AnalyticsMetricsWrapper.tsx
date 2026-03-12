import type { WidgetServerProps } from "payload";

import React from "react";

import AnalyticsMetrics from "./AnalyticsMetrics.js";

export default function AnalyticsMetricsWrapper(props: WidgetServerProps) {
  const period = (props.widgetData?.period as string) ?? "7days";
  return <AnalyticsMetrics period={period} />;
}
