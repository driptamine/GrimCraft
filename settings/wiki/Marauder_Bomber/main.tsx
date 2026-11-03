import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Marauder_BomberArticle } from '../../../src/wiki/articles/Marauder_BomberData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Marauder_BomberArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Marauder_BomberArticle} />);
}
