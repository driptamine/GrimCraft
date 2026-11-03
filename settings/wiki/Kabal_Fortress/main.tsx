import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Kabal_FortressArticle } from '../../../src/wiki/articles/Kabal_FortressData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Kabal_FortressArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Kabal_FortressArticle} />);
}
