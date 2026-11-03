import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Howling_BansheesArticle } from '../../../src/wiki/articles/Howling_BansheesData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Howling_BansheesArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Howling_BansheesArticle} />);
}
