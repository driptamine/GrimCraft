import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Waaagh_Banner_Dark_CrusadeArticle } from '../../../src/wiki/articles/Waaagh_Banner_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Waaagh_Banner_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Waaagh_Banner_Dark_CrusadeArticle} />);
}
