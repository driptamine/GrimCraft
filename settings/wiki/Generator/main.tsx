import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { GeneratorArticle } from '../../../src/wiki/articles/GeneratorData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `GeneratorArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={GeneratorArticle} />);
}
