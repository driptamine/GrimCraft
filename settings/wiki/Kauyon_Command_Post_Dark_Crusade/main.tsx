import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Kauyon_Command_Post_Dark_CrusadeArticle } from '../../../src/wiki/articles/Kauyon_Command_Post_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Kauyon_Command_Post_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Kauyon_Command_Post_Dark_CrusadeArticle} />);
}
