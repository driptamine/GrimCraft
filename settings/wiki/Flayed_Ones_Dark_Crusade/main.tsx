import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Flayed_Ones_Dark_CrusadeArticle } from '../../../src/wiki/articles/Flayed_Ones_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Flayed_Ones_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Flayed_Ones_Dark_CrusadeArticle} />);
}
