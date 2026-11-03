import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Desecrated_StrongholdArticle } from '../../../src/wiki/articles/Desecrated_StrongholdData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Desecrated_StrongholdArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Desecrated_StrongholdArticle} />);
}
