import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Purgatus_Mine_FieldArticle } from '../../../src/wiki/articles/Purgatus_Mine_FieldData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Purgatus_Mine_FieldArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Purgatus_Mine_FieldArticle} />);
}
