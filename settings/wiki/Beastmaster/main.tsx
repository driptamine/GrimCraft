import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { BeastmasterArticle } from '../../../src/wiki/articles/BeastmasterData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `BeastmasterArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={BeastmasterArticle} />);
}
