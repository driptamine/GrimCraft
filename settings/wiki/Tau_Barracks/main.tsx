import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Tau_BarracksArticle } from '../../../src/wiki/articles/Tau_BarracksData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Tau_BarracksArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Tau_BarracksArticle} />);
}
