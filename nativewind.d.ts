/// <reference types="nativewind" />
import { ViewProps, TextProps, ScrollViewProps, TextInputProps, TouchableOpacityProps } from "react-native";

declare module "react-native" {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface ScrollViewProps {
    className?: string;
  }
  interface TextInputProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
}

declare module "*.css" {
  const content: string;
  export default content;
}
