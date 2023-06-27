import { useState } from "react";
import { useRouter } from "next/router";

import { PageLoader } from "@components/Loading";
import { GridSix, ParentGrid } from "@components/Layout/GridLayout";

import { frankRuhlLibre } from "@styles/fonts";
import {
  DocumentMagnifyingGlassIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import LatestPapers from "@components/LatestPapers";
import CardInfo from "@components/CardInfo";
import RecentlyIndexed from "@components/RecentlyIndexed";
import { getArXivIdentifier, isValidURL, urlToID } from "@utils/formatter";

import { searchArxivPapers } from "@utils/arxiv";

const HomePage = () => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [invalidLink, setInvalidLink] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentSearch, setCurentSearch] = useState("");
  const [isError, setIsError] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setInvalidLink(false);
  };

  const handleEnter = async () => {
    if (isValidURL(inputValue)) {
      const arxivId = getArXivIdentifier(inputValue);
      router.push(`/a/${arxivId}`);
    } else {
      setInvalidLink(false);
      setIsSearching(true);
      setCurentSearch(inputValue);
      const papers = await searchArxivPapers(inputValue);

      if (papers) {
        setSearchResults(papers.slice(0, 10));
      } else {
        setIsError(true);
      }
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      handleEnter();
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setCurentSearch("");
  };

  return (
    <main>
      <div className="flex justify-center">
        <div className="bg-maber-200 flex-col justify-center">
          <div
            className={`${frankRuhlLibre.variable} font-serif text-gray-700 text-lg max-w-xl mx-auto`}
          >
            arXivGPT turns research papers into interactive Q&A sessions, making
            complex academic content easily understandable and accessible for
            all.
          </div>
          <div className="flex w-full justify-center">
            <div className="mt-3 flex mb-3 align-center rounded-lg border-2 p-2 w-full max-w-xl">
              <DocumentMagnifyingGlassIcon className="h-6 w-6 my-auto text-gray-300" />
              <input
                type="text"
                placeholder="Search papers by keywords or enter an arXiv URL"
                className="px-2 placeholder-slate-300 relative bg-white rounded text-sm w-full focus:outline-none"
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="my-auto ml-4 p-3 rounded-lg bg-orange-500 hover:cursor-pointer hover:bg-orange-600">
              <MagnifyingGlassIcon
                className="h-3 w-3 scale-125 text-stone-100"
                onClick={handleEnter}
              />
            </div>
          </div>
          <div className={invalidLink ? "text-red-500 text-xs" : "invisible"}>
            Invalid search query!
          </div>
        </div>
      </div>

      {currentSearch.length > 0 ? (
        <>
          {isSearching ? (
            <PageLoader />
          ) : (
            <ParentGrid>
              <div className="col-span-12">
                <div className="flex w-full justify-between">
                  <div className="flex">
                    <span>
                      <MagnifyingGlassIcon className="w-8 h-8 mr-2 text-orange-500" />
                    </span>
                    <div
                      className={`${frankRuhlLibre.variable} font-serif text-3xl mb-4`}
                    >
                      {`Showing top 10 results for "${currentSearch}"`}
                    </div>
                  </div>
                  <div
                    className="mt-1 hover:cursor-pointer hover:text-orange-500 rounded-md hover:bg-slate-50 w-fit h-fit px-2 py-1"
                    onClick={clearSearch}
                  >
                    Back to Explore
                  </div>
                </div>
              </div>
              <GridSix>
                <div className="grid gap-4 -mt-8">
                  {searchResults.slice(0, 5).map((paper, index) => (
                    <CardInfo paper={paper} key={index} />
                  ))}
                </div>
              </GridSix>
              <GridSix>
                <div className="grid gap-4 -mt-5 lg:-mt-8">
                  {searchResults.slice(5, 10).map((paper, index) => (
                    <CardInfo paper={paper} key={index} />
                  ))}
                </div>
              </GridSix>
            </ParentGrid>
          )}
        </>
      ) : (
        <ParentGrid>
          <GridSix>
            <RecentlyIndexed />
          </GridSix>
          <GridSix>
            <LatestPapers />
          </GridSix>
        </ParentGrid>
      )}
    </main>
  );
};

export default HomePage;
