import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { XV8_Crisis_Battlesuit_TeamArticle } from '../../../src/wiki/articles/XV8_Crisis_Battlesuit_TeamData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `XV8_Crisis_Battlesuit_TeamArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={XV8_Crisis_Battlesuit_TeamArticle} />);
}
