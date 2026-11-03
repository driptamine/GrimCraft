import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Field_CommandArticle } from '../../../src/wiki/articles/Field_CommandData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Field_CommandArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Field_CommandArticle} />);
}
