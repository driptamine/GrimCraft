import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Dawn_of_War_Jumping_and_TeleportingArticle } from '../../../src/wiki/articles/Dawn_of_War_Jumping_and_TeleportingData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Dawn_of_War_Jumping_and_TeleportingArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Dawn_of_War_Jumping_and_TeleportingArticle} />);
}
