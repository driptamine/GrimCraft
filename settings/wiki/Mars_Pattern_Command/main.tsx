import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Mars_Pattern_CommandArticle } from '../../../src/wiki/articles/Mars_Pattern_CommandData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Mars_Pattern_CommandArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Mars_Pattern_CommandArticle} />);
}
