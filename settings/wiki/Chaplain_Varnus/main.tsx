import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Chaplain_VarnusArticle } from '../../../src/wiki/articles/Chaplain_VarnusData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Chaplain_VarnusArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Chaplain_VarnusArticle} />);
}
