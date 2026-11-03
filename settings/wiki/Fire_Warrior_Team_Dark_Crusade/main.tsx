import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Fire_Warrior_Team_Dark_CrusadeArticle } from '../../../src/wiki/articles/Fire_Warrior_Team_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Fire_Warrior_Team_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Fire_Warrior_Team_Dark_CrusadeArticle} />);
}
