import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Greater_KnarlocArticle } from '../../../src/wiki/articles/Greater_KnarlocData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Greater_KnarlocArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Greater_KnarlocArticle} />);
}
