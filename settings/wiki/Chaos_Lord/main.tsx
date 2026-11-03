import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Chaos_LordArticle } from '../../../src/wiki/articles/Chaos_LordData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Chaos_LordArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Chaos_LordArticle} />);
}
