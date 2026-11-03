import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Warlord_Gorgutz_Ead_UnterArticle } from '../../../src/wiki/articles/Warlord_Gorgutz_Ead_UnterData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Warlord_Gorgutz_Ead_UnterArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Warlord_Gorgutz_Ead_UnterArticle} />);
}
