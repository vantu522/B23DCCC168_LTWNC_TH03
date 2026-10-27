"use client";

import React from "react";
import { Button as AntdButton, ButtonProps as AntdButtonProps } from "antd";

export interface CustomButtonProps extends Omit<AntdButtonProps, "variant"> {
  themeVariant?: "primary" | "secondary" | "danger" | "ghost";
}

export function Button({ themeVariant, className, children, ...props }: CustomButtonProps) {
  let customClass = className || "";

  if (themeVariant === "primary") {
    customClass += " bg-[#c8102e] hover:bg-[#b00e28] text-white";
  } else if (themeVariant === "danger") {
    customClass += " hover:bg-red-50 text-red-600";
  }

  return (
    <AntdButton className={customClass} {...props}>
      {children}
    </AntdButton>
  );
}

export default Button;
