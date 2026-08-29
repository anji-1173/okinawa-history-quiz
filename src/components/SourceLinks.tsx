import { sourceById } from "../data/sources";

export default function SourceLinks({ sourceIds }: { sourceIds: string[] }) {
  return (
    <div className="source-links" aria-label="この解説の出典">
      <span className="source-links__label">出典</span>
      {sourceIds.map((sourceId) => {
        const source = sourceById[sourceId];
        if (!source) return null;
        return (
          <a key={sourceId} href={source.url} target="_blank" rel="noreferrer">
            {source.organization}「{source.title}」
            <span aria-hidden="true"> ↗</span>
          </a>
        );
      })}
    </div>
  );
}
