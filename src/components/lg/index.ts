/**
 * UI Design Minimal: barrel. Import everything from "@/components/lg".
 * Pages import ONLY from "@/components/lg" (plus shadcn/ui if the project has it).
 * Need something new? Build it here first, add it to /styleguide, document it in docs/DESIGN_SYSTEM.md.
 */
export { Button, buttonVariants, type ButtonProps } from "./Button";
export { Container } from "./Container";
export { Section } from "./Section";
export { SectionHeader } from "./SectionHeader";
export { Glass } from "./Glass";
export { Reveal, RevealText } from "./Reveal";
export { SmoothScroll, useLenis } from "./SmoothScroll";
export { SmartLink, ScrollManager, isExternalHref, type SmartLinkProps } from "./SmartLink";
export { usePageMeta } from "./PageMeta";
export { GlassNav, type NavItem } from "./GlassNav";
export { DockNav } from "./DockNav";
export { Marquee } from "./Marquee";
export { ScrollStory, type StoryStep } from "./ScrollStory";
export { ScrollScale } from "./ScrollScale";
export { CountUp } from "./CountUp";
export { SegmentedControl, type SegmentOption } from "./SegmentedControl";
export { Tile, TileMedia, MediaCard } from "./Surface";
export { ArrowLink, Stat, InlineSignup, TrustItem, FeatureItem } from "./Content";
export { StickyCTA } from "./StickyCTA";
export { Haze, Aurora, PhoneFrame, WindowFrame } from "./Frames";
export { FloatingDevice } from "./FloatingDevice";
export { VideoPanel, type VideoSource } from "./VideoPanel";
export { CardRail, RailCard, RailControls, useCardRail, type CardRailState } from "./CardRail";
export { AccordionShowcase, type ShowcaseItem } from "./AccordionShowcase";
export { DeviceStage } from "./DeviceStage";
export { FaqList, type FaqItem } from "./FaqList";
export { useMediaQuery, usePrefersReducedMotion, useFinePointer } from "./hooks";
export { PageHero, CheckRow } from "./PageHero";
export { PricingTier, PlanBanner, ComparisonTable, type ComparisonGroup, type ComparisonRow, type ComparisonValue } from "./Pricing";
export { Field, TextInput, TextArea } from "./Form";
export { CtaSection, PhotoCollage, ActionRow, ChipList, type CollagePhoto } from "./Blocks";
export { LinkAdapterProvider, scrollToId, type LinkAdapter } from "./SmartLink";
export * as Icons from "./icons";
export type { IconProps } from "./icons";
// product layer
export { AppShell, Toolbar, ToolbarGroup, ToolbarButton, AppContent, UISectionHeader, useAppShell, type AppNavItem, type AppNavSection } from "./AppShell";
export { UICard, UICardHeader, Badge, Metric, Sparkline, LineChart, BarChart, BarList, Legend, DataTable, Pagination, Avatar, Meter, Skeleton, EmptyState, DescriptionList, type Column, type Series, type Tone } from "./Data";
export { Switch, Checkbox, UIInput, SearchField, Select, Menu, Tooltip, Dialog, Sheet, ToastProvider, useToast, Tabs, type MenuEntry } from "./Controls";
// scroll showpieces
export { MediaExpand, TextReveal, StackCards, PinnedGallery, ZoomThrough, ParallaxColumns, ScrollProgress } from "./Scroll";
