import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Gabriel_AngelosArticle } from '../../../src/wiki/articles/Gabriel_AngelosData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Gabriel_AngelosArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Gabriel_AngelosArticle} />);
}
