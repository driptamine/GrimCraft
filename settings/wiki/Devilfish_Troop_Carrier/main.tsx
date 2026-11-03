import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Devilfish_Troop_CarrierArticle } from '../../../src/wiki/articles/Devilfish_Troop_CarrierData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Devilfish_Troop_CarrierArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Devilfish_Troop_CarrierArticle} />);
}
