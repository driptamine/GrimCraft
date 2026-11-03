import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { XV15_Stealth_Team_Dark_CrusadeArticle } from '../../../src/wiki/articles/XV15_Stealth_Team_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `XV15_Stealth_Team_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={XV15_Stealth_Team_Dark_CrusadeArticle} />);
}
