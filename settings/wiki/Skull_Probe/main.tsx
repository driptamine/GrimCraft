import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Skull_ProbeArticle } from '../../../src/wiki/articles/Skull_ProbeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Skull_ProbeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Skull_ProbeArticle} />);
}
