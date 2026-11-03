import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Marine_SergeantArticle } from '../../../src/wiki/articles/Marine_SergeantData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Marine_SergeantArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Marine_SergeantArticle} />);
}
