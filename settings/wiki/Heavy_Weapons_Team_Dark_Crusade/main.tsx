import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Heavy_Weapons_Team_Dark_CrusadeArticle } from '../../../src/wiki/articles/Heavy_Weapons_Team_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Heavy_Weapons_Team_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Heavy_Weapons_Team_Dark_CrusadeArticle} />);
}
