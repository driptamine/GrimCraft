import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Cultist_Aspiring_ChampionArticle } from '../../../src/wiki/articles/Cultist_Aspiring_ChampionData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Cultist_Aspiring_ChampionArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Cultist_Aspiring_ChampionArticle} />);
}
