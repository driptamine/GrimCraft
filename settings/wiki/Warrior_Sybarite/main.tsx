import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Warrior_SybariteArticle } from '../../../src/wiki/articles/Warrior_SybariteData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Warrior_SybariteArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Warrior_SybariteArticle} />);
}
