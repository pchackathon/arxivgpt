import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import NextNProgress from "nextjs-progressbar";
import React from "react";

const SiteLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NextNProgress
        height={3}
        color="#f97316"
        options={{ showSpinner: false }}
      />
      <Navbar />
      <div className="mx-auto max-w-7xl w-full py-6 px-4 sm:px-6 lg:px-8 lg:py-12">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default SiteLayout;
