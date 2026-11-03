import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Possessed_Squad_Dark_CrusadeArticle } from '../../../src/wiki/articles/Possessed_Squad_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Possessed_Squad_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Possessed_Squad_Dark_CrusadeArticle} />);
}
