/** Every URL and CTA of the demo lives here (single source of truth for links). */
// Hosts that do not serve folder indexes can build with LG_INDEX=index.html.
const IDX: string = import.meta.env.VITE_LG_INDEX ?? "";

export const site = {
  name: "Minimal",
  author: { name: "Tammo Elsner", linkedin: "https://www.linkedin.com/in/tammo-elsner-682998186/" },
  links: {
    repo: "https://github.com/tammo1007/ui-design-minimal",
    designMd: "https://github.com/tammo1007/ui-design-minimal/blob/main/DESIGN.md",
    freedesignmd: "https://freedesignmd.com/system/minimalistic",
    alyn: "https://alyn.dev",
    home: `${import.meta.env.BASE_URL}${IDX}`,
    dashboard: `${import.meta.env.BASE_URL}dashboard/${IDX}`,
    styleguide: `${import.meta.env.BASE_URL}styleguide/${IDX}`,
  },
  nav: [
    { label: "Components", href: "#components" },
    { label: "Scroll", href: "#scroll" },
    { label: "For agents", href: "#agents" },
    { label: "FAQ", href: "#faq" },
  ],
};
