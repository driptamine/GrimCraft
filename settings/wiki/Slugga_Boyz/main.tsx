import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Slugga_BoyzArticle } from '../../../src/wiki/articles/Slugga_BoyzData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Slugga_BoyzArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Slugga_BoyzArticle} />);
}
