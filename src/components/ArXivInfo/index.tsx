import { Disclosure } from "@headlessui/react";

import {
  ChevronDownIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/20/solid";
import { idToURL } from "@utils/formatter";

export default function ArXivInfo({ arxivId, metadata }) {
  return (
    <div className="w-full">
      <div className="text-2xl font-semibold">{`[${arxivId}] ${metadata.title}`}</div>
      <div className="font-medium mt-2 text-blue-800">
        {metadata.authors.join(", ")}
      </div>
      <a
        target="_blank"
        href={idToURL(arxivId as string)}
        rel="noopener noreferrer"
      >
        <div className="mt-1 flex align-center text-sm text-gray-700 hover:text-black hover:cursor-pointer">
          Open in arXiv
          <ArrowTopRightOnSquareIcon className="h-3 w-3 ml-2 my-auto scale-125" />
        </div>
      </a>
      <div className="mt-4 py-3 border-y-2 border-gray-400">
        <Disclosure defaultOpen>
          <Disclosure.Button className="w-full">
            <div className="w-full flex justify-between">
              <div className="font-semibold">Abstract</div>
              <ChevronDownIcon
                className="h-5 w-5 ml-1 text-orange-500 scale-150"
                style={{ strokeWidth: "4px" }}
              />
            </div>
          </Disclosure.Button>
          <Disclosure.Panel>
            <div className="pl-8 mt-2 text-sm ">{metadata.abstract}</div>
          </Disclosure.Panel>
        </Disclosure>
      </div>
    </div>
  );
}
