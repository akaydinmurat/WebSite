export type InternalHref = "/" | `/${string}`;

export interface NavigationItem {
  id: string;
  label: string;
  href: InternalHref;
  match: "exact" | "prefix";
  description?: string;
}

export interface NavigationConfig {
  primary: readonly NavigationItem[];
  footer: readonly NavigationItem[];
  contactAction: NavigationItem;
}
