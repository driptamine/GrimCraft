import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Dark_Crusade_units_listArticle } from '../../../src/wiki/articles/Dark_Crusade_units_listData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Dark_Crusade_units_listArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Dark_Crusade_units_listArticle} />);
}
