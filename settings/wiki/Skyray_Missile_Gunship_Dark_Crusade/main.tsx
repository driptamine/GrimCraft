import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Skyray_Missile_Gunship_Dark_CrusadeArticle } from '../../../src/wiki/articles/Skyray_Missile_Gunship_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Skyray_Missile_Gunship_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Skyray_Missile_Gunship_Dark_CrusadeArticle} />);
}
