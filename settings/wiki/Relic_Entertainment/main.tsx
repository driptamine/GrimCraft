import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Relic_EntertainmentArticle } from '../../../src/wiki/articles/Relic_EntertainmentData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Relic_EntertainmentArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Relic_EntertainmentArticle} />);
}
