// Keep the standalone editor outside the game's dependency graph at startup.
if (/^\/balance\/?$/.test(location.pathname)) {
  document.title = 'Balance Editor · GrimCraft';
  document.body.replaceChildren();
  void import('./balance/editor.jsx').then(module => module.mountBalanceEditor());
} else {
  void Promise.all([import('./hud/index.jsx'), import('./core/game.js')]);
}
