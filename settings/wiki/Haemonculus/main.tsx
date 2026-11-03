import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { HaemonculusArticle } from '../../../src/wiki/articles/HaemonculusData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `HaemonculusArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={HaemonculusArticle} />);
}
