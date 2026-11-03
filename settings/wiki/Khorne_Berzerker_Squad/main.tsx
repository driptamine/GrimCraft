import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Khorne_Berzerker_SquadArticle } from '../../../src/wiki/articles/Khorne_Berzerker_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Khorne_Berzerker_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Khorne_Berzerker_SquadArticle} />);
}
