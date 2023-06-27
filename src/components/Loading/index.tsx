import { Grid, RotatingSquare, BallTriangle } from "react-loader-spinner";

export const PageLoader = () => {
  return (
    <div className="w-full h-[80vh] flex items-center justify-center">
      <div>
        <Grid
          height={80}
          width={80}
          color="#f97316"
          ariaLabel="grid-loading"
          radius={12.5}
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    </div>
  );
};

export const NamespaceLoader = ({ step }) => {
  return (
    <div className="bg-slate-50 rounded-2xl flex justify-center items-center h-96">
      <div className="flex flex-col items-center">
        {" "}
        {step === 1 ? (
          <>
            <BallTriangle
              height={80}
              width={80}
              radius={5}
              color="#f97316"
              ariaLabel="ball-triangle-loading"
              visible={true}
            />
          </>
        ) : (
          <>
            <RotatingSquare
              height={80}
              width={80}
              ariaLabel="rotating-square"
              visible={true}
              color="#f97316"
              strokeWidth="10"
            />
          </>
        )}
        <div className="flex flex-col justify-center items-center text-md mt-8">
          <span>{step === 1 ? "Retrieving index..." : "arXiv not found."}</span>
          {step !== 1 && (
            <>
              <span>Adding article to index...</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const IndexedLoader = () => {
  return (
    <div className="flex justify-center items-center h-96">
      <div className="flex flex-col items-center">
        <BallTriangle
          height={80}
          width={80}
          radius={5}
          color="#f97316"
          ariaLabel="ball-triangle-loading"
          visible={true}
        />
      </div>
    </div>
  );
};
