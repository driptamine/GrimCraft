import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Chaos_TempleArticle } from '../../../src/wiki/articles/Chaos_TempleData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Chaos_TempleArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Chaos_TempleArticle} />);
}
