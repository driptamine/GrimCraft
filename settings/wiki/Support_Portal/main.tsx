import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Support_PortalArticle } from '../../../src/wiki/articles/Support_PortalData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Support_PortalArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Support_PortalArticle} />);
}
