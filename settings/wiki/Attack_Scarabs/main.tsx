import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Attack_ScarabsArticle } from '../../../src/wiki/articles/Attack_ScarabsData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Attack_ScarabsArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Attack_ScarabsArticle} />);
}
