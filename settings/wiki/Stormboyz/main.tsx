import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { StormboyzArticle } from '../../../src/wiki/articles/StormboyzData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `StormboyzArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={StormboyzArticle} />);
}
