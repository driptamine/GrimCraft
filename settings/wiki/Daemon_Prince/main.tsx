import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Daemon_PrinceArticle } from '../../../src/wiki/articles/Daemon_PrinceData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Daemon_PrinceArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Daemon_PrinceArticle} />);
}
