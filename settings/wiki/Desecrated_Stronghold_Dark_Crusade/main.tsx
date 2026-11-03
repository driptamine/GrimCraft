import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Desecrated_Stronghold_Dark_CrusadeArticle } from '../../../src/wiki/articles/Desecrated_Stronghold_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Desecrated_Stronghold_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Desecrated_Stronghold_Dark_CrusadeArticle} />);
}
