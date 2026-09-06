import { Fragment, type ReactNode } from "react";
import { furigana, furiganaTerms } from "../data/furigana";

interface RubyProps {
  text: string;
}

// 本文中に現れた難読語を、用語集（furigana）に基づいて <ruby> で装飾する。
// 長い語から優先照合するので、複合語（首里城）が単独語（首里）より先に一致する。
export default function Ruby({ text }: RubyProps) {
  const nodes: ReactNode[] = [];
  let plain = "";
  let index = 0;

  const flushPlain = () => {
    if (plain) {
      nodes.push(<Fragment key={`t${index}`}>{plain}</Fragment>);
      plain = "";
    }
  };

  while (index < text.length) {
    const term = furiganaTerms.find((candidate) => text.startsWith(candidate, index));
    if (term) {
      flushPlain();
      nodes.push(
        <ruby key={`r${index}`}>
          {term}
          <rt aria-hidden="true">{furigana[term]}</rt>
        </ruby>,
      );
      index += term.length;
    } else {
      plain += text[index];
      index += 1;
    }
  }
  flushPlain();

  return <>{nodes}</>;
}
