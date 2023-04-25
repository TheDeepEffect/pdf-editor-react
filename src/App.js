import logo from "./logo.svg";
import "./App.css";
import PdfViewerComponent from "./components/PdfViewerComponent";
import { useState } from "react";

function App() {
  const [pdfFile, setPdfFile] = useState(null);

  return (
    <div className="App">
      <label>
        PDF:{" "}
        <input
          type="file"
          accept="pdf"
          onChange={(e) => {
            const documentBlobObjectUrl = URL.createObjectURL(
              e.target.files[0]
            );
            console.log(documentBlobObjectUrl);

            setPdfFile(documentBlobObjectUrl);
          }}
        />
      </label>
      <div className="PDF-viewer">
        {pdfFile ? (
          <PdfViewerComponent document={pdfFile} />
        ) : (
          <h1>Upload a file</h1>
        )}
      </div>
    </div>
  );
}

export default App;
