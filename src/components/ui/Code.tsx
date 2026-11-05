import { Fragment, type ReactNode } from 'react';
import { cx } from './primitives';

type Lang = 'sql' | 'vba';

const SQL_KW = new Set(
  'select from where join left right inner outer on group by order having limit as and or not in is null case when then else end distinct asc desc union all insert into values create table primary key with like between'.split(' '),
);
const SQL_FN = new Set('sum count avg min max round strftime coalesce date substr upper lower cast'.split(' '));
const VBA_KW = new Set(
  'sub end function dim as set for each next in if then else elseif with to do loop while until call exit private public const new nothing true false and or not byval byref step'.split(' '),
);
const VBA_FN = new Set('range cells worksheets workbooks sheets application format msgbox now date activeworkbook thisworkbook'.split(' '));

/** Tiny tokenizer → React spans. Good enough for short, readable snippets. */
export function highlight(code: string, lang: Lang): ReactNode[] {
  const pattern =
    lang === 'sql'
      ? /(--[^\n]*)|('(?:[^']|'')*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|(.)/g
      : /('[^\n]*)|("(?:[^"]|"")*")|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|(.)/g;
  const kw = lang === 'sql' ? SQL_KW : VBA_KW;
  const fn = lang === 'sql' ? SQL_FN : VBA_FN;
  const out: ReactNode[] = [];
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = pattern.exec(code))) {
    const [tok, com, str, num, word] = m;
    const key = i++;
    if (com) out.push(<span key={key} className="tok-com">{tok}</span>);
    else if (str) out.push(<span key={key} className="tok-str">{tok}</span>);
    else if (num) out.push(<span key={key} className="tok-num">{tok}</span>);
    else if (word && kw.has(word.toLowerCase())) out.push(<span key={key} className="tok-kw">{tok}</span>);
    else if (word && fn.has(word.toLowerCase())) out.push(<span key={key} className="tok-fn">{tok}</span>);
    else out.push(<Fragment key={key}>{tok}</Fragment>);
  }
  return out;
}

export function CodeBlock({ code, lang, title, className }: { code: string; lang: Lang; title?: string; className?: string }) {
  return (
    <figure className={cx('overflow-hidden rounded-2xl border border-line bg-surface-2', className)}>
      {title && (
        <figcaption className="flex items-center gap-2 border-b border-line px-4 py-2.5">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-rose/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-lavender/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-gold/50" />
          </span>
          <span className="eyebrow ml-2 !text-[10px]">{title}</span>
        </figcaption>
      )}
      <pre className="scrollbar-thin overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-fg">
        <code>{highlight(code, lang)}</code>
      </pre>
    </figure>
  );
}
