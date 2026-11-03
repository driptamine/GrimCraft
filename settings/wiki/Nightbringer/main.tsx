import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { NightbringerArticle } from '../../../src/wiki/articles/NightbringerData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `NightbringerArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={NightbringerArticle} />);
}
