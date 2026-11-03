import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Vehicle_BeaconArticle } from '../../../src/wiki/articles/Vehicle_BeaconData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Vehicle_BeaconArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Vehicle_BeaconArticle} />);
}
