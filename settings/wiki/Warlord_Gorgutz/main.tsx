import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Warlord_GorgutzArticle } from '../../../src/wiki/articles/Warlord_GorgutzData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Warlord_GorgutzArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Warlord_GorgutzArticle} />);
}
