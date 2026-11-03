import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Mine_Field_Imperial_Guard_Dark_CrusadeArticle } from '../../../src/wiki/articles/Mine_Field_Imperial_Guard_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Mine_Field_Imperial_Guard_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Mine_Field_Imperial_Guard_Dark_CrusadeArticle} />);
}
