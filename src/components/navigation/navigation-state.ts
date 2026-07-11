import type { NavigationItem } from "@/types";

function normalizePathname(pathname: string) {
  const [path = "/"] = pathname.split(/[?#]/, 1);

  if (path === "/") {
    return path;
  }

  return path.replace(/\/+$/, "") || "/";
}

export function isNavigationItemActive(pathname: string, item: NavigationItem) {
  const currentPath = normalizePathname(pathname);
  const itemPath = normalizePathname(item.href);

  if (item.match === "exact") {
    return currentPath === itemPath;
  }

  if (itemPath === "/") {
    return currentPath === "/";
  }

  return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
}
