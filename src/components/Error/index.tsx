import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export const InvalidIdError = () => {
  return (
    <div className="w-full h-[80vh] flex items-center justify-center">
      <div className="">
        <ExclamationCircleIcon className="mx-auto w-32 h-32 text-orange-500" />
        <div className="flex justify-center mt-4 text-2xl">
          Invalid arXiv ID
        </div>
        <Link href="/">
          <div className="mt-8 py-2 px-5 justify-center rounded-lg bg-orange-500 text-white text-2xl hover:cursor-pointer hover:bg-orange-600">
            Back to Explore
          </div>
        </Link>
      </div>
    </div>
  );
};
