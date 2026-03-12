import type { WidgetServerProps } from "payload";

import React from "react";

import AnalyticsTopPages from "./AnalyticsTopPages.js";

export default function AnalyticsTopPagesWrapper(props: WidgetServerProps) {
  const period = (props.widgetData?.period as string) ?? "7days";
  return <AnalyticsTopPages period={period} />;
}
