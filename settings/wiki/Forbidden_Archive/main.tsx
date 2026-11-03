import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Forbidden_ArchiveArticle } from '../../../src/wiki/articles/Forbidden_ArchiveData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Forbidden_ArchiveArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Forbidden_ArchiveArticle} />);
}
