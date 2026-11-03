import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Vespid_Strain_LeaderArticle } from '../../../src/wiki/articles/Vespid_Strain_LeaderData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Vespid_Strain_LeaderArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Vespid_Strain_LeaderArticle} />);
}
