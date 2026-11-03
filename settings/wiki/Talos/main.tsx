import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { TalosArticle } from '../../../src/wiki/articles/TalosData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `TalosArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={TalosArticle} />);
}
