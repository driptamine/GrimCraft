import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Category_DoW_StubsArticle } from '../../../src/wiki/articles/Category_DoW_StubsData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Category_DoW_StubsArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Category_DoW_StubsArticle} />);
}
