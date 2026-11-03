import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Raptor_Aspiring_ChampionArticle } from '../../../src/wiki/articles/Raptor_Aspiring_ChampionData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Raptor_Aspiring_ChampionArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Raptor_Aspiring_ChampionArticle} />);
}
