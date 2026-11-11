// Shared by menu startup and the lobby browser; independent of game boot.
export function serverIdFromPath(pathname: string): string | null {
  const match = /^\/server\/([^/]+)\/?$/.exec(pathname);
  if (!match) return null;
  try {
    const id = decodeURIComponent(match[1]);
    return id && !/[\\/]/.test(id) ? id : null;
  } catch { return null; }
}

export function serverPath(serverId: string): string {
  return `/server/${encodeURIComponent(serverId)}`;
}

export function setServerRoute(serverId: string | null): void {
  const pathname = serverId == null ? '/' : serverPath(serverId);
  if (window.location.pathname === pathname || (serverId != null && serverIdFromPath(window.location.pathname) === serverId)) return;
  // Keep model/quality query options when navigating or sharing a test match.
  window.history.pushState(null, '', `${pathname}${window.location.search}`);
}
