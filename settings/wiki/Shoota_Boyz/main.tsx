import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Shoota_BoyzArticle } from '../../../src/wiki/articles/Shoota_BoyzData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Shoota_BoyzArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Shoota_BoyzArticle} />);
}
