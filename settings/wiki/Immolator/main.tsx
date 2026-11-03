import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { ImmolatorArticle } from '../../../src/wiki/articles/ImmolatorData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `ImmolatorArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={ImmolatorArticle} />);
}
