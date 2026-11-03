import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Attack_Scarabs_Dark_CrusadeArticle } from '../../../src/wiki/articles/Attack_Scarabs_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Attack_Scarabs_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Attack_Scarabs_Dark_CrusadeArticle} />);
}
