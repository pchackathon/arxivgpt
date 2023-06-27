import ArXivViewer from "@components/ArXivViewer";
import { NamespaceLoader, PageLoader } from "@components/Loading";
import { GridFive, GridSeven, ParentGrid } from "@components/Layout/GridLayout";
import { useRouter } from "next/router";

import { frankRuhlLibre } from "@styles/fonts";

import Link from "next/link";
import Head from "next/head";

import { useEffect, useState } from "react";

import { ChevronDoubleLeftIcon } from "@heroicons/react/20/solid";
import ArXivInfo from "@components/ArXivInfo";
import { PrivateChat } from "@components/Chat/PrivateChat";
import { PublicChat } from "@components/Chat/PublicChat";
import { createNewArchive, getArchive } from "@utils/dynamo";
import { isValidArXivId } from "@utils/formatter";
import { InvalidIdError } from "@components/Error";
import { fetchArXivMetadata } from "@utils/arxiv";

export default function Home() {
  const [metadata, setMetadata] = useState<any>(null);
  const [namespaceLoaderState, setNamespaceLoaderState] = useState<Number>(1);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [invalid, setInvalid] = useState<boolean>(false);
  const [summary, setSummary] = useState<any>(null);
  const [messageHistory, setMessageHistory] = useState<any>(null);

  const {
    query: { arxivId },
  } = useRouter();

  useEffect(() => {
    const fetchArchive = async () => {
      if (arxivId && isValidArXivId(arxivId)) {
        try {
          const archive = await getArchive(arxivId);
          if (!archive) {
            setNamespaceLoaderState(2);
            await fetch("/api/addArXiv", {
              method: "POST",
              body: JSON.stringify({ arxivId }),
              headers: {
                "Content-Type": "application/json",
              },
            });
            createNewArchive(arxivId).then((summary) => {
              setSummary(summary);
              setNamespaceLoaderState(3);
            });
          } else {
            setSummary(archive.summary);
            setMessageHistory(archive.messageHistory);
            setNamespaceLoaderState(3);
          }
        } catch (error) {
          console.error("Error retrieving namespace:", error);
        }
      }
    };

    fetchArchive();
  }, [arxivId]);

  useEffect(() => {
    if (arxivId) {
      if (isValidArXivId(arxivId)) {
        fetchArXivMetadata(arxivId).then((metadata) => {
          setMetadata(metadata);
        });
      } else {
        setInvalid(!isValidArXivId(arxivId));
      }
    }
  }, [arxivId]);

  if (invalid) {
    return (
      <div>
        <InvalidIdError />
      </div>
    );
  }

  if (arxivId === null || metadata === null) {
    return (
      <div>
        <PageLoader />
      </div>
    );
  }

  return (
    <main>
      <Head>
        <title>{`[${arxivId}] | arXivGPT`}</title>
        <meta name="description" content="GPT Powered arXiv Experience" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex w-full justify-between mb-2">
        <div className="hover:cursor-pointer rounded-md group hover:bg-slate-50 w-fit">
          <Link className="flex px-2 text-md flex items-center py-2" href="/">
            <ChevronDoubleLeftIcon className="h-3 w-3 scale-150 mr-2 text-orange-500 pb-[1px]" />
            <div className="font-mono text-sm font-mono uppercase text-center">
              Explore
            </div>
          </Link>
        </div>
        <div className="sharethis-inline-share-buttons"></div>
      </div>
      <ParentGrid>
        <GridSeven className="">
          <ArXivInfo arxivId={arxivId} metadata={metadata} />
          <div className="mt-8">
            <ArXivViewer arxivId={arxivId} />
          </div>
        </GridSeven>
        <GridFive>
          <div
            className={`mb-4 flex text-xl ${frankRuhlLibre.variable} font-serif justify-between items-center`}
          >
            <div className="flex">
              <div
                className={`px-4 pt-2 pb-1 hover:bg-slate-50 hover:cursor-pointer ${
                  activeTab === 1 ? "border-b-4 border-orange-500" : ""
                }`}
                onClick={() => {
                  setActiveTab(1);
                }}
              >
                Public
              </div>
              <div
                className={`px-4 pt-2 pb-1 hover:bg-slate-50 hover:cursor-pointer ${
                  activeTab === 2 ? "border-b-4 border-orange-500" : ""
                }`}
                onClick={() => {
                  setActiveTab(2);
                }}
              >
                Private
              </div>
            </div>
            {namespaceLoaderState === 3 && (
              <div
                className={`px-4 pt-2 pb-1 hover:bg-slate-50 hover:cursor-pointer ${
                  activeTab === 3 ? "border-b-4 border-orange-500" : ""
                }`}
                onClick={() => {
                  setActiveTab(3);
                }}
              >
                ELI5
              </div>
            )}
          </div>
          <div className={`${activeTab === 3 ? "hidden" : "block"}`}>
            <div className="mb-4 text-gray-800 text-lg">
              {activeTab === 1 && "Share what you ask with others!"}
              {activeTab === 2 && "Chat will be saved to your local storage."}
            </div>
            {namespaceLoaderState === 3 ? (
              <div className="w-full h-full">
                <div
                  className={`${
                    activeTab === 1 ? "block" : "hidden"
                  } transition-opacity duration-300 w-full h-full`}
                >
                  <PublicChat
                    arxivId={arxivId}
                    messageHistory={messageHistory}
                  />
                </div>
                <div
                  className={`${
                    activeTab === 2 ? "block" : "hidden"
                  } transition-opacity duration-300 w-full h-full`}
                >
                  <PrivateChat arxivId={arxivId} />
                </div>
              </div>
            ) : (
              <NamespaceLoader step={namespaceLoaderState} />
            )}
          </div>
          {activeTab === 3 && (
            <div className="w-full rounded-lg bg-slate-100 p-4 text-gray-500">
              {summary}
            </div>
          )}
        </GridFive>
      </ParentGrid>
    </main>
  );
}
