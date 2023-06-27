import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { idToPDF } from "@utils/formatter";

export default function ArXivViewer({ arxivId }) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <main>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.7.107/build/pdf.worker.js">
        <div
          style={{
            height: "750px",
            width: "100%",
          }}
        >
          <Viewer
            fileUrl={idToPDF(arxivId)}
            plugins={[defaultLayoutPluginInstance]}
            theme={{
              theme: "light",
            }}
          />
        </div>
      </Worker>
    </main>
  );
}
