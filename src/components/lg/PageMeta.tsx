import { useEffect } from "react";

interface PageMetaOptions {
  /** ≤ 60 characters: omit to leave the head alone (routes with their own head()) */
  title?: string;
  /** ≤ 160 characters */
  description?: string;
  /** absolute canonical URL, e.g. https://example.com/ */
  canonical?: string;
}

function upsert(selector: string, create: () => HTMLElement, set: (el: HTMLElement) => void) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  set(el);
}

const meta = (attr: "name" | "property", key: string, content: string) =>
  upsert(
    `meta[${attr}="${key}"]`,
    () => {
      const m = document.createElement("meta");
      m.setAttribute(attr, key);
      return m;
    },
    (el) => el.setAttribute("content", content),
  );

/**
 * Per-page title, description, canonical and Open Graph/Twitter text (client side).
 * Keep the same values in index.html for the home page (crawlers without JS);
 * TanStack Start projects put them into the route's head() instead.
 */
export function usePageMeta({ title, description, canonical }: PageMetaOptions) {
  useEffect(() => {
    if (!title || !description) return;
    document.title = title;
    meta("name", "description", description);
    meta("property", "og:title", title);
    meta("property", "og:description", description);
    meta("name", "twitter:title", title);
    meta("name", "twitter:description", description);
    if (canonical) {
      meta("property", "og:url", canonical);
      upsert(
        'link[rel="canonical"]',
        () => {
          const l = document.createElement("link");
          l.setAttribute("rel", "canonical");
          return l;
        },
        (el) => el.setAttribute("href", canonical),
      );
    }
  }, [title, description, canonical]);
}
