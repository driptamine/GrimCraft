import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Lord_Destroyer_Dark_CrusadeArticle } from '../../../src/wiki/articles/Lord_Destroyer_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Lord_Destroyer_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Lord_Destroyer_Dark_CrusadeArticle} />);
}
