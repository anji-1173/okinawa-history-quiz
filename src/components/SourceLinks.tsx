import { sourceById } from "../data/sources";

export default function SourceLinks({ sourceIds }: { sourceIds: string[] }) {
  return (
    <div className="source-links" aria-label="この解説の出典">
      <span className="source-links__label">出典（別タブで開く）</span>
      {sourceIds.map((sourceId) => {
        const source = sourceById[sourceId];
        if (!source) return null;
        return (
          <a key={sourceId} href={source.url} target="_blank" rel="noreferrer" title="別タブで開きます。クイズへは元のタブに戻ってください。">
            {source.organization}「{source.title}」
            <span aria-hidden="true"> ↗</span>
          </a>
        );
      })}
    </div>
  );
}

