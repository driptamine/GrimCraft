import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Haemonculus_LaboratoryArticle } from '../../../src/wiki/articles/Haemonculus_LaboratoryData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Haemonculus_LaboratoryArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Haemonculus_LaboratoryArticle} />);
}
