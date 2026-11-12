import { Container, SmartLink } from "@/components/lg";
import { Logo } from "./Brand";
import { site } from "./site";

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline py-section-sm">
      <Container className="grid grid-cols-1 gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-4 max-w-[34ch] text-small text-ink-2">An Apple-like Liquid Glass design system for landing pages and product UI. Open source, MIT.</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-3">
          {[
            { title: "System", links: [{ label: "Landing demo", href: site.links.home }, { label: "Dashboard demo", href: site.links.dashboard }, { label: "Styleguide", href: site.links.styleguide }] },
            { title: "For agents", links: [{ label: "DESIGN.md", href: site.links.designMd }, { label: "GitHub", href: site.links.repo }] },
            { title: "Also on", links: [{ label: "freedesignmd.com", href: site.links.freedesignmd }, { label: "alyn.dev", href: site.links.alyn }] },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-label text-ink-2">{col.title}</p>
              <ul className="mt-3 grid grid-cols-1 gap-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <SmartLink href={l.href} className="text-small text-ink hover:text-ink-2">
                      {l.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <p className="text-caption text-ink-2 md:col-span-12">
          Made by{" "}
          <SmartLink href={site.author.linkedin} target="_blank" className="text-ink underline decoration-hairline-strong underline-offset-4 hover:decoration-ink">
            {site.author.name}
          </SmartLink>
          . Not affiliated with Apple Inc. No Apple fonts or assets are included.
        </p>
      </Container>
    </footer>
  );
}
