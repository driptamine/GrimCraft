import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Lightning_FighterArticle } from '../../../src/wiki/articles/Lightning_FighterData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Lightning_FighterArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Lightning_FighterArticle} />);
}
