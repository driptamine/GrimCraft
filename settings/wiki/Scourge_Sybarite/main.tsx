import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Scourge_SybariteArticle } from '../../../src/wiki/articles/Scourge_SybariteData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Scourge_SybariteArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Scourge_SybariteArticle} />);
}
