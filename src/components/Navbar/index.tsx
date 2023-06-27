import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { AboutModal } from "@components/AboutModal";
import { frankRuhlLibre } from "@styles/fonts";

const Navbar = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <div className="bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div
          className={`${frankRuhlLibre.variable} font-serif relative flex h-16 items-center justify-between`}
        >
          <div className="flex items-center justify-center sm:items-stretch">
            <div className="-mt-1 flex items-center">
              <Link href="/">
                <Image
                  src="/arxivgpt.png"
                  alt="arXivGPT Logo"
                  width={180}
                  height={90}
                  priority={true}
                />
              </Link>
            </div>
          </div>
          <div className="flex gap-8 text-lg">
            <div
              className="hover:cursor-pointer my-auto"
              onClick={() => setIsModalVisible(true)}
            >
              About
            </div>
            <a
              href="https://twitter.com/generalizable_"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm rounded-2xl rounded-xl text-white bg-[#1DA1F2] hover:bg-[#0C84D2]"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22.46 6.012c-.77.343-1.597.575-2.463.68.887-.53 1.57-1.37 1.885-2.37-.83.492-1.75.85-2.724 1.042-.782-.834-1.897-1.354-3.13-1.354-2.37 0-4.29 1.92-4.29 4.29 0 .336.038.663.11.977-3.56-.18-6.723-1.885-8.834-4.48-.37.63-.58 1.37-.58 2.15 0 1.48.75 2.79 1.885 3.56-.697-.022-1.356-.213-1.93-.53v.05c0 2.07 1.47 3.8 3.42 4.19-.36.098-.73.15-1.11.15-.27 0-.53-.026-.79-.075.53 1.66 2.07 2.87 3.89 2.9-1.42 1.11-3.21 1.77-5.15 1.77-.335 0-.665-.02-.99-.058 1.83 1.17 4 1.85 6.33 1.85 7.57 0 11.7-6.27 11.7-11.7 0-.18-.004-.36-.012-.54.8-.58 1.5-1.3 2.05-2.12z"></path>
              </svg>
              Follow Us
            </a>
          </div>
        </div>
      </div>
      {isModalVisible && (
        <AboutModal onClose={() => setIsModalVisible(false)} />
      )}
    </div>
  );
};

export default Navbar;
