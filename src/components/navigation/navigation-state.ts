import type { NavigationItem } from "@/types";

type NavigationSearchParams = Pick<URLSearchParams, "get"> | string | null;

function normalizePathname(pathname: string) {
  const [path = "/"] = pathname.split(/[?#]/, 1);

  if (path === "/") {
    return path;
  }

  return path.replace(/\/+$/, "") || "/";
}

function getScene(searchParams: NavigationSearchParams | undefined, pathname: string) {
  if (typeof searchParams === "string") {
    return new URLSearchParams(searchParams).get("scene");
  }

  if (searchParams) {
    return searchParams.get("scene");
  }

  const query = pathname.split("?", 2)[1]?.split("#", 1)[0];

  return query ? new URLSearchParams(query).get("scene") : null;
}

function getItemScene(item: NavigationItem) {
  const query = item.href.split("?", 2)[1]?.split("#", 1)[0];

  return query ? new URLSearchParams(query).get("scene") : null;
}

export function isNavigationItemActive(
  pathname: string,
  item: NavigationItem,
  searchParams?: NavigationSearchParams,
) {
  const currentPath = normalizePathname(pathname);
  const itemPath = normalizePathname(item.href);
  const currentScene = getScene(searchParams, pathname);
  const itemScene = getItemScene(item);

  if (currentPath === "/") {
    if (itemScene) {
      return currentScene === itemScene;
    }

    if (itemPath === "/") {
      return currentScene === null;
    }
  }

  if (itemScene) {
    const directPath = `/${itemScene}`;

    return currentPath === directPath || currentPath.startsWith(`${directPath}/`);
  }

  if (item.match === "exact") {
    return currentPath === itemPath;
  }

  if (itemPath === "/") {
    return currentPath === "/";
  }

  return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
}
