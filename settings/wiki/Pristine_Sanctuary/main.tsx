import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Pristine_SanctuaryArticle } from '../../../src/wiki/articles/Pristine_SanctuaryData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Pristine_SanctuaryArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Pristine_SanctuaryArticle} />);
}
