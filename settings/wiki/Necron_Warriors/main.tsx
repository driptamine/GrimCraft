import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Necron_WarriorsArticle } from '../../../src/wiki/articles/Necron_WarriorsData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Necron_WarriorsArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Necron_WarriorsArticle} />);
}
