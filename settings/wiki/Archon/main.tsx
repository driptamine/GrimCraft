import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { ArchonArticle } from '../../../src/wiki/articles/ArchonData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `ArchonArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={ArchonArticle} />);
}
