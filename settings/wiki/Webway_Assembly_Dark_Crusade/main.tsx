import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Webway_Assembly_Dark_CrusadeArticle } from '../../../src/wiki/articles/Webway_Assembly_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Webway_Assembly_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Webway_Assembly_Dark_CrusadeArticle} />);
}
