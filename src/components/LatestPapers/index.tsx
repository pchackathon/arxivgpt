import { useEffect, useState } from "react";
import { frankRuhlLibre } from "@styles/fonts";
import CardInfo from "@components/CardInfo";
import { formatDate } from "@utils/formatter";

const LatestPapers = () => {
  const [latestPapers, setLatestPapers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchLatestPapers() {
      try {
        const response = await fetch(
          "https://export.arxiv.org/api/query?search_query=all&sortBy=submittedDate&sortOrder=descending&max_results=5"
        );
        const data = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "text/xml");
        const entries = xmlDoc.getElementsByTagName("entry");

        const papers = Array.from(entries).map((entry) => {
          const title = entry.getElementsByTagName("title")[0].textContent;
          const authors = Array.from(entry.getElementsByTagName("author")).map(
            (author) => author.textContent
          );
          const summary = entry.getElementsByTagName("summary")[0].textContent;
          const arxivId = entry.getElementsByTagName("id")[0].textContent;
          const dateStr =
            entry.getElementsByTagName("published")[0].textContent;
          const formattedDate = formatDate(dateStr);
          return { title, authors, summary, arxivId, date: formattedDate };
        });

        setLatestPapers(papers);
      } catch (error) {
        console.error("Error fetching latest papers:", error);
      }
    }

    fetchLatestPapers();
  }, []);

  return (
    <div className="container mx-auto">
      <div className={`${frankRuhlLibre.variable} font-serif text-3xl`}>
        Latest in ArXiv
      </div>
      <div className="w-full h-[2px] bg-orange-500 mt-2 mb-4 rounded-2xl" />
      <div className="grid gap-4">
        {latestPapers.length > 0 ? (
          <>
            {latestPapers.map((paper, index) => (
              <CardInfo paper={paper} key={index} />
            ))}
          </>
        ) : (
          <>
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex w-full">
                <div className="w-full animate-pulse flex-row items-center">
                  <div className="h-32 w-full rounded-md bg-gray-200" />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default LatestPapers;
