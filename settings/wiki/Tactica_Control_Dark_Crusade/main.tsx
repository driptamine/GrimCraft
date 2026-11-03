import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Tactica_Control_Dark_CrusadeArticle } from '../../../src/wiki/articles/Tactica_Control_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Tactica_Control_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Tactica_Control_Dark_CrusadeArticle} />);
}
