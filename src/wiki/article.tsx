import type { JSX } from 'react';
import { styled } from '@linaria/react';
import type { WikiBlock, WikiCell, WikiRun, WikiSection } from './guardsmenSquadData.js';

export interface WikiArticle {
  title: string;
  subtitle: string;
  sections: WikiSection[];
}

export const WikiWrap = styled.div`
  max-width: 1000px; margin: 0 auto; padding: 16px 18px 60px;
  background: #fff; color: #000;
  font-family: sans-serif; font-size: 14px; line-height: 1.5;
`;

export const WikiCrumbs = styled.div`
  font-size: 12px; margin-bottom: 8px;
`;

export const WikiTitle = styled.h1`
  font-size: 24px; font-weight: normal;
  border-bottom: 1px solid #aaa; padding-bottom: 4px; margin: 0 0 4px;
`;

export const WikiH2 = styled.h2`
  font-size: 18px; font-weight: normal;
  border-bottom: 1px solid #aaa; padding-bottom: 4px; margin-top: 30px;
`;

export const WikiH3 = styled.h3`
  font-size: 15px; margin-top: 22px;
`;

export const WikiParagraph = styled.p`
  margin: 8px 0;
`;

export const WikiLink = styled.a`
  color: #0645ad;
  text-decoration: none;
  &:visited { color: #0b0080; }
  &:hover { text-decoration: underline; }
`;

export const WikiTable = styled.table`
  border-collapse: collapse; margin: 10px 0; font-size: 12px;
  td, th { border: 1px solid #aaa; padding: 5px 12px; text-align: left; vertical-align: top; }
`;

export const WikiInfobox = styled.table`
  float: right; width: 300px; margin: 0 0 12px 14px;
  border: 1px solid #aaa; background: #f9f9f9; font-size: 12px;
  border-collapse: collapse;
  td, th { border-top: 1px solid #ddd; padding: 5px 10px; vertical-align: top; }
  @media (max-width: 700px) { float: none; width: 100%; margin: 0 0 16px; }
`;

export const WikiToc = styled.div`
  border: 1px solid #aaa; background: #f9f9f9;
  display: inline-block; padding: 8px 20px 8px 12px; margin: 8px 0 4px; font-size: 12px;
`;

export const WikiFoot = styled.div`
  margin-top: 40px; padding-top: 10px;
  border-top: 1px solid #aaa; font-size: 11px; color: #555;
`;

const WIKI_ORIGIN = 'https://warhammer-guide.ru';
const WIKI_BASE = `${WIKI_ORIGIN}/wiki/`;

// Article data keeps media paths as they appear on the wiki (`images/foo.jpg`,
// `/skins/common/images/foo.png`). Resolve them against warhammer-guide.ru so
// they don't 404 against the local `/settings/wiki/<page>/` route.
export function wikiAssetUrl(src: string): string {
  if (/^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(src) || src.startsWith('data:')) {
    return src;
  }
  if (src.startsWith('/')) {
    return WIKI_ORIGIN + src;
  }
  return WIKI_BASE + src.replace(/^\.\//, '');
}

function isWikiMedia(href: string): boolean {
  return href.startsWith('images/') || href.startsWith('/skins/');
}

export function WikiRuns({ runs }: { runs: WikiRun[] }): JSX.Element {
  return (
    <>
      {runs.map((run, i) => {
        if (run.br) {
          return <br key={i} />;
        }
        if (run.image) {
          return <img key={i} src={wikiAssetUrl(run.image)} alt={run.alt || ''} />;
        }
        if (run.link) {
          return (
            <WikiLink key={i} href={isWikiMedia(run.link) ? wikiAssetUrl(run.link) : run.link}>
              <WikiRuns runs={run.runs || []} />
            </WikiLink>
          );
        }
        const style = {
          fontWeight: run.bold ? 'bold' : undefined,
          fontStyle: run.italic ? 'italic' : undefined,
        };
        return (
          <span key={i} style={style}>
            {run.text}
          </span>
        );
      })}
    </>
  );
}

export function WikiCellView({ cell }: { cell: WikiCell }): JSX.Element {
  const Tag = cell.header ? 'th' : 'td';
  const style: Record<string, string | number> = {};
  if (cell.bg) {
    style.background = cell.bg;
  }
  const props: Record<string, unknown> = { style };
  if (cell.colspan) {
    props.colSpan = cell.colspan;
  }
  if (cell.rowspan) {
    props.rowSpan = cell.rowspan;
  }
  return (
    <Tag {...props}>
      <WikiRuns runs={cell.runs} />
    </Tag>
  );
}

export function WikiBlockView({ block }: { block: WikiBlock }): JSX.Element | null {
  if (block.block === 'p') {
    return (
      <WikiParagraph>
        <WikiRuns runs={block.runs} />
      </WikiParagraph>
    );
  }
  if (block.block === 'toc') {
    return (
      <WikiToc>
        <b>Contents</b>
        <ol style={{ margin: 0, paddingLeft: 20 }}>
          {block.items.map((item, i) => (
            <li key={i} style={{ marginLeft: item.level * 20 }}>
              <WikiLink href={item.href}>
                {item.n ? `${item.n} ` : ''}
                {item.text}
              </WikiLink>
            </li>
          ))}
        </ol>
      </WikiToc>
    );
  }
  if (block.cls === 'infobox') {
    return (
      <WikiInfobox style={block.width ? { width: block.width } : undefined}>
        <tbody>
          {block.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <WikiCellView key={j} cell={cell} />
              ))}
            </tr>
          ))}
        </tbody>
      </WikiInfobox>
    );
  }
  return (
    <WikiTable style={block.width ? { width: block.width } : undefined}>
      <tbody>
        {block.rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <WikiCellView key={j} cell={cell} />
            ))}
          </tr>
        ))}
      </tbody>
    </WikiTable>
  );
}

export function WikiArticlePage({ article, footer }: { article: WikiArticle; footer?: string }): JSX.Element {
  return (
    <WikiWrap>
      <WikiCrumbs>
        <WikiLink href="../../index.html">GRIMCRAFT</WikiLink>
        {` / WIKI / ${article.title.toUpperCase()}`}
      </WikiCrumbs>
      <WikiTitle>{article.title}</WikiTitle>
      {article.sections.map((section, i) => (
        <section key={i}>
          {section.level === 2 && section.h ? <WikiH2 id={section.anchor}>{section.h}</WikiH2> : null}
          {section.level === 3 && section.h ? <WikiH3 id={section.anchor}>{section.h}</WikiH3> : null}
          {section.blocks.map((block, j) => (
            <WikiBlockView key={j} block={block} />
          ))}
        </section>
      ))}
      {footer ? <WikiFoot>{footer}</WikiFoot> : null}
    </WikiWrap>
  );
}
