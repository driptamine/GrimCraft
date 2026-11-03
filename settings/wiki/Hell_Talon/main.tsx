import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Hell_TalonArticle } from '../../../src/wiki/articles/Hell_TalonData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Hell_TalonArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Hell_TalonArticle} />);
}
