import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { NecronsArticle } from '../../../src/wiki/articles/NecronsData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `NecronsArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={NecronsArticle} />);
}
