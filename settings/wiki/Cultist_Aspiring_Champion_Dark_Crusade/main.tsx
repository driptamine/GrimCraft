import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Cultist_Aspiring_Champion_Dark_CrusadeArticle } from '../../../src/wiki/articles/Cultist_Aspiring_Champion_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Cultist_Aspiring_Champion_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Cultist_Aspiring_Champion_Dark_CrusadeArticle} />);
}
