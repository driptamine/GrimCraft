import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Fighta_BommaArticle } from '../../../src/wiki/articles/Fighta-BommaData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Fighta_BommaArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Fighta_BommaArticle} />);
}
