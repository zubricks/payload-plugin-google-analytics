import type { WidgetServerProps } from "payload";

import React from "react";

import ChannelGroups from "./ChannelGroups.js";

export default function ChannelGroupsWrapper(props: WidgetServerProps) {
  const period = (props.widgetData?.period as string) ?? "7days";
  return <ChannelGroups period={period} />;
}
