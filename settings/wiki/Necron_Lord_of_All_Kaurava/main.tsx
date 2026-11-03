import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Necron_Lord_of_All_KauravaArticle } from '../../../src/wiki/articles/Necron_Lord_of_All_KauravaData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Necron_Lord_of_All_KauravaArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Necron_Lord_of_All_KauravaArticle} />);
}
