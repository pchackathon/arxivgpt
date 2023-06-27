import Link from "next/link";
import { getArXivIdentifier, isValidArXivId } from "@utils/formatter";

export default function CardInfo({ paper }) {
  let arxivId = getArXivIdentifier(paper.arxivId);

  if (isValidArXivId(paper.arxivId)) {
    arxivId = paper.arxivId;
  }

  return (
    <Link href={`/a/${arxivId}`}>
      <div className="rounded-md p-2 group hover:bg-slate-50 hover:cursor-pointer">
        <h3 className="leading-tight text-lg mb-1">
          [{arxivId}] {paper.title}
        </h3>
        <div className="flex justify-between w-full text-sm mb-2">
          <p className="leading-tight line-clamp-2 font-medium text-sm text-blue-800 w-3/5">
            {paper.authors.join(", ")}
          </p>
          <p className="text-gray-500">{paper.date}</p>
        </div>
        <p className="leading-tight line-clamp-3 text-xs text-gray-500">
          {paper.summary}
        </p>
      </div>
    </Link>
  );
}
