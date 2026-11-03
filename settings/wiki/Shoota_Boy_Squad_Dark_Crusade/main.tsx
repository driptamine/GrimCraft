import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Shoota_Boy_Squad_Dark_CrusadeArticle } from '../../../src/wiki/articles/Shoota_Boy_Squad_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Shoota_Boy_Squad_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Shoota_Boy_Squad_Dark_CrusadeArticle} />);
}
