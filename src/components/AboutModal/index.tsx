import { useEffect, useRef } from "react";

export const AboutModal = ({ onClose }) => {
  const modalRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    const handleMouseDownOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleMouseDownOutside);
    return () => {
      document.removeEventListener("mousedown", handleMouseDownOutside);
    };
  }, [onClose]);

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onKeyDown={handleKeyDown}
    >
      <div
        ref={modalRef}
        className="text-slate-600 inline-block max-h-[400px] transform overflow-y-auto rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:max-h-[600px] sm:w-full max-w-md lg:max-w-lg mx-2 sm:p-6 sm:align-middle"
        role="dialog"
        onClick={handleModalClick}
      >
        <div className="text-xl mb-2">About</div>
        <div className="text-gray-500">
          arXivGPT transforms arXiv research papers into interactive
          conversations. It allows users to ask questions, explore sections, and
          request summaries, making academic research more accessible and
          digestible. Ideal for researchers, students, or anyone seeking to
          quickly understand complex papers.
          <br />
          <br />
          arXivGPT is a free service by Generalizable.xyz, a research studio
          experimenting in AI. To get in touch, email{" "}
          <a href="mailto:hello@generalizable.xyz" className="text-blue-500">
            hello@generalizable.xyz
          </a>{" "}
          or follow us on Twitter{" "}
          <a
            href="https://twitter.com/generalizable_"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            @generalizable_
          </a>
          .
        </div>
      </div>
    </div>
  );
};
