import { useEffect, useState } from "react";
import { frankRuhlLibre } from "@styles/fonts";
import CardInfo from "@components/CardInfo";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { IndexedLoader } from "@components/Loading";
import { fetchBatchArxivMetadata } from "@utils/arxiv";

const RecentlyIndexed = () => {
  const [latestPapers, setLatestPapers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchLatestPapers() {
      try {
        const response = await fetch("/api/archives/latest");
        if (response.ok) {
          const arxivIds = await response.json();
          // console.log({ arxivIds });
          const arxivMetadata = await fetchBatchArxivMetadata(arxivIds);
          // console.log({ arxivMetadata });

          setLatestPapers(arxivMetadata);
        } else {
          console.error("Failed to fetch latest papers:", response.status);
        }
      } catch (error) {
        console.error("Error fetching latest papers:", error);
      }
    }

    fetchLatestPapers();
  }, []);

  return (
    <div className="container mx-auto">
      <div className="flex w-full justify-between">
        <div className="flex">
          <span>
            <ChartBarIcon className="w-8 h-8 mr-2 text-orange-500" />
          </span>
          <div
            className={`${frankRuhlLibre.variable} font-serif text-3xl mb-4`}
          >
            Recently Indexed
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {latestPapers.length > 0 ? (
          <>
            {latestPapers.map((paper, index) => (
              <CardInfo paper={paper} key={index} />
            ))}
          </>
        ) : (
          <>
            <IndexedLoader />
          </>
        )}
      </div>
    </div>
  );
};

export default RecentlyIndexed;
