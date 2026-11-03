import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Chaos_Sorcerer_Dark_CrusadeArticle } from '../../../src/wiki/articles/Chaos_Sorcerer_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Chaos_Sorcerer_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Chaos_Sorcerer_Dark_CrusadeArticle} />);
}
