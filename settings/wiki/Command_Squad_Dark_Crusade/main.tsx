import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Command_Squad_Dark_CrusadeArticle } from '../../../src/wiki/articles/Command_Squad_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Command_Squad_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Command_Squad_Dark_CrusadeArticle} />);
}
