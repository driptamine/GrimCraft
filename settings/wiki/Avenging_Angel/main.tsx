import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Avenging_AngelArticle } from '../../../src/wiki/articles/Avenging_AngelData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Avenging_AngelArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Avenging_AngelArticle} />);
}
