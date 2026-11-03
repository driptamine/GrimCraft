import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Tau_CommanderArticle } from '../../../src/wiki/articles/Tau_CommanderData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Tau_CommanderArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Tau_CommanderArticle} />);
}
