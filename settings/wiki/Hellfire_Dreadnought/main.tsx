import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Hellfire_DreadnoughtArticle } from '../../../src/wiki/articles/Hellfire_DreadnoughtData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Hellfire_DreadnoughtArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Hellfire_DreadnoughtArticle} />);
}
