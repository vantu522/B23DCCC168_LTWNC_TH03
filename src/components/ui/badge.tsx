"use client";

import React from "react";
import { Badge as AntdBadge, Tag as AntdTag } from "antd";

export interface CustomBadgeProps {
  count?: number;
  color?: string;
  children?: React.ReactNode;
}

export function Badge({ count, color, children }: CustomBadgeProps) {
  return (
    <AntdBadge count={count} color={color}>
      {children}
    </AntdBadge>
  );
}

export const Tag = AntdTag;
export default Badge;
