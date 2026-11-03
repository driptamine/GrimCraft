import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Aspect_PortalArticle } from '../../../src/wiki/articles/Aspect_PortalData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Aspect_PortalArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Aspect_PortalArticle} />);
}
