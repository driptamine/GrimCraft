import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Daemon_PitArticle } from '../../../src/wiki/articles/Daemon_PitData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Daemon_PitArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Daemon_PitArticle} />);
}
