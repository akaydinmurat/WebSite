import type { NavigationConfig, NavigationItem } from "@/types";

export const primaryNavigation = [
  {
    id: "home",
    label: "Ana Sayfa",
    href: "/",
    match: "exact",
    description: "Stüdyo seçkisine dön",
  },
  {
    id: "projects",
    label: "Projeler",
    href: "/projects",
    match: "prefix",
    description: "Kavramsal proje seçkisini keşfet",
  },
  {
    id: "services",
    label: "Hizmetler",
    href: "/services",
    match: "prefix",
    description: "Çalışma alanlarını incele",
  },
  {
    id: "packages",
    label: "Paketler",
    href: "/packages",
    match: "prefix",
    description: "Örnek tasarım kapsamlarını karşılaştır",
  },
  {
    id: "about",
    label: "Stüdyo",
    href: "/about",
    match: "prefix",
    description: "Yaklaşımı ve süreci tanı",
  },
  {
    id: "contact",
    label: "İletişim",
    href: "/contact",
    match: "prefix",
    description: "Yeni bir proje üzerine konuş",
  },
] as const satisfies readonly NavigationItem[];

export const footerNavigation = primaryNavigation;

export const contactNavigationItem = {
  id: "start-a-project",
  label: "Bir proje başlat",
  href: "/contact",
  match: "prefix",
  description: "Proje ihtiyaçlarını paylaş",
} as const satisfies NavigationItem;

export const navigationConfig = {
  primary: primaryNavigation,
  footer: footerNavigation,
  contactAction: contactNavigationItem,
} satisfies NavigationConfig;
