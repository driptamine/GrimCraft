import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Orky_Pop_and_WaaghArticle } from '../../../src/wiki/articles/Orky_Pop_and_WaaghData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Orky_Pop_and_WaaghArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Orky_Pop_and_WaaghArticle} />);
}
