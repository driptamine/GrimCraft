import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Soul_CageArticle } from '../../../src/wiki/articles/Soul_CageData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Soul_CageArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Soul_CageArticle} />);
}
