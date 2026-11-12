/** Every URL and CTA of the demo lives here (single source of truth for links). */
export const site = {
  name: "Minimal",
  author: { name: "Tammo Elsner", linkedin: "https://www.linkedin.com/in/tammo-elsner-682998186/" },
  links: {
    repo: "https://github.com/tammo1007/ui-design-minimal",
    designMd: "https://github.com/tammo1007/ui-design-minimal/blob/main/DESIGN.md",
    freedesignmd: "https://freedesignmd.com/system/minimalistic",
    alyn: "https://alyn.dev",
    home: import.meta.env.BASE_URL,
    dashboard: `${import.meta.env.BASE_URL}dashboard/`,
    styleguide: `${import.meta.env.BASE_URL}styleguide/`,
  },
  nav: [
    { label: "Components", href: "#components" },
    { label: "Scroll", href: "#scroll" },
    { label: "For agents", href: "#agents" },
    { label: "FAQ", href: "#faq" },
  ],
};
