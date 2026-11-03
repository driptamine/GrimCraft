import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Howling_Banshee_SquadArticle } from '../../../src/wiki/articles/Howling_Banshee_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Howling_Banshee_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Howling_Banshee_SquadArticle} />);
}
