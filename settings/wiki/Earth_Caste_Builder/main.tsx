import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Earth_Caste_BuilderArticle } from '../../../src/wiki/articles/Earth_Caste_BuilderData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Earth_Caste_BuilderArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Earth_Caste_BuilderArticle} />);
}
