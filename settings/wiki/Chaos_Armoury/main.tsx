import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Chaos_ArmouryArticle } from '../../../src/wiki/articles/Chaos_ArmouryData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Chaos_ArmouryArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Chaos_ArmouryArticle} />);
}
