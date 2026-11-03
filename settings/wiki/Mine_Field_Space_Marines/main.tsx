import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Mine_Field_Space_MarinesArticle } from '../../../src/wiki/articles/Mine_Field_Space_MarinesData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Mine_Field_Space_MarinesArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Mine_Field_Space_MarinesArticle} />);
}
