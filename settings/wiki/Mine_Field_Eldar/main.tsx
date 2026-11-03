import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Mine_Field_EldarArticle } from '../../../src/wiki/articles/Mine_Field_EldarData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Mine_Field_EldarArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Mine_Field_EldarArticle} />);
}
