import { catamaran } from "@styles/fonts";

const Footer = () => {
  return (
    <div className="bg-slate-100">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-0">
        <div className="relative flex items-center justify-center p-3">
          <div
            className={`${catamaran.variable} font-sans text-xs text-gray-500`}
          >
            Thank you to arXiv for use of its open access interoperability. This
            product was not reviewed or approved by, nor does it necessarily
            express or reflect the policies or opinions of, arXiv.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
