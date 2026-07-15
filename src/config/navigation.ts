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
    href: "/?scene=projects#experience-projects",
    match: "exact",
    description: "Proje sahnesini keşfet",
  },
  {
    id: "services",
    label: "Hizmetler",
    href: "/?scene=services#experience-showcase",
    match: "exact",
    description: "Çalışma alanlarını deneyimle",
  },
  {
    id: "packages",
    label: "Paketler",
    href: "/?scene=packages#experience-packages",
    match: "exact",
    description: "Tasarım kapsamlarını karşılaştır",
  },
  {
    id: "reviews",
    label: "Yorumlar",
    href: "/?scene=reviews#experience-reviews",
    match: "exact",
    description: "Müşteri deneyimlerini incele",
  },
  {
    id: "about",
    label: "Hakkımda",
    href: "/?scene=about#experience-vision",
    match: "exact",
    description: "Göknur'un yaklaşımını ve deneyimini tanı",
  },
] as const satisfies readonly NavigationItem[];

export const footerNavigation = [
  {
    id: "home",
    label: "Ana Sayfa",
    href: "/",
    match: "exact",
  },
  {
    id: "projects",
    label: "Projeler",
    href: "/projects",
    match: "prefix",
  },
  {
    id: "services",
    label: "Hizmetler",
    href: "/services",
    match: "prefix",
  },
  {
    id: "packages",
    label: "Paketler",
    href: "/packages",
    match: "prefix",
  },
  {
    id: "about",
    label: "Hakkımda",
    href: "/about",
    match: "prefix",
  },
  {
    id: "contact",
    label: "İletişim",
    href: "/contact",
    match: "prefix",
  },
] as const satisfies readonly NavigationItem[];

export const contactNavigationItem = {
  id: "start-a-project",
  label: "Hayalinizi mekâna dönüştürelim",
  href: "/?scene=contact#experience-contact",
  match: "exact",
  description: "Yeni proje görüşmesini başlat",
} as const satisfies NavigationItem;

export const navigationConfig = {
  primary: primaryNavigation,
  footer: footerNavigation,
  contactAction: contactNavigationItem,
} satisfies NavigationConfig;
