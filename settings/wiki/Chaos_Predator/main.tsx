import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Chaos_PredatorArticle } from '../../../src/wiki/articles/Chaos_PredatorData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Chaos_PredatorArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Chaos_PredatorArticle} />);
}
