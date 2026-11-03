import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { StrongholdArticle } from '../../../src/wiki/articles/StrongholdData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `StrongholdArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={StrongholdArticle} />);
}
