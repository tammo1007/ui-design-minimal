import { createElement, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type ContainerSize = "text" | "content" | "wide" | "full";

const sizeClass: Record<ContainerSize, string> = {
  text: "lg-container lg-container--text",
  content: "lg-container",
  wide: "lg-container lg-container--wide",
  full: "lg-container lg-container--full",
};

interface ContainerProps extends HTMLAttributes<HTMLElement> {
  /** text 704 · content 1200 (default) · wide 1440 · full: gutters are always applied */
  size?: ContainerSize;
  as?: "div" | "section" | "header" | "footer" | "main" | "nav" | "article";
  children?: ReactNode;
}

/** The ONLY way to constrain page width. Never use max-w-* + px-* on sections directly. */
export function Container({ size = "content", as = "div", className, ...props }: ContainerProps) {
  return createElement(as, { className: cn(sizeClass[size], className), ...props });
}
