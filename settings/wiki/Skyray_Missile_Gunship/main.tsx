import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Skyray_Missile_GunshipArticle } from '../../../src/wiki/articles/Skyray_Missile_GunshipData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Skyray_Missile_GunshipArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Skyray_Missile_GunshipArticle} />);
}
