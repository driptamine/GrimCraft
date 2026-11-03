import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Soul_PowersArticle } from '../../../src/wiki/articles/Soul_PowersData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Soul_PowersArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Soul_PowersArticle} />);
}
