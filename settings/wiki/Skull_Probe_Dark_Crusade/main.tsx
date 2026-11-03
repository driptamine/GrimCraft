import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Skull_Probe_Dark_CrusadeArticle } from '../../../src/wiki/articles/Skull_Probe_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Skull_Probe_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Skull_Probe_Dark_CrusadeArticle} />);
}
