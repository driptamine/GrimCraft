import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Dawn_of_War_Single_Player_Quotes_Winter_AssaultArticle } from '../../../src/wiki/articles/Dawn_of_War_Single_Player_Quotes_Winter_AssaultData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Dawn_of_War_Single_Player_Quotes_Winter_AssaultArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Dawn_of_War_Single_Player_Quotes_Winter_AssaultArticle} />);
}
