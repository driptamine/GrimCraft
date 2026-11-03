import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Chaplain_Dark_CrusadeArticle } from '../../../src/wiki/articles/Chaplain_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Chaplain_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Chaplain_Dark_CrusadeArticle} />);
}
