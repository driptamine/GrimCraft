import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Chaos_SorcererArticle } from '../../../src/wiki/articles/Chaos_SorcererData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Chaos_SorcererArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Chaos_SorcererArticle} />);
}
