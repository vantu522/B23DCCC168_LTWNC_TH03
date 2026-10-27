"use client";

import React from "react";
import { Input as AntdInput, InputProps as AntdInputProps } from "antd";

export type CustomInputProps = AntdInputProps;

export function Input(props: CustomInputProps) {
  return <AntdInput {...props} />;
}

export const { Search, TextArea, Password } = AntdInput;
export default Input;
