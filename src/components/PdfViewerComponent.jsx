import { useEffect, useRef } from "react";

export default function PdfViewerComponent(props) {
  const containerRef = useRef(null);

  let instance, PSPDFKit, pdfToSaveorSubmit, pdfToSaveorSubmitFlat;
  useEffect(() => {
    const container = containerRef.current;
    (async function () {
      PSPDFKit = await import("pspdfkit");
      PSPDFKit.unload(container);

      instance = await PSPDFKit.load({
        // Container where PSPDFKit should be mounted.
        container,
        // The document to open.
        document: props.document,
        // Use the public directory URL as a base URL. PSPDFKit will download its library assets from here.
        baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
        toolbarItems: [
          ...PSPDFKit.defaultToolbarItems,
          {
            type: "form-creator",
          },
        ],
      });
      instance.addEventListener(
        "formFieldValues.update",
        async (formFieldValues) => {
          instance.save();
          let pdf = await instance.exportPDF();
          pdfToSaveorSubmitFlat = await instance.exportPDF({ flatten: true });

          // The code to upload this PDF with the saved data goes here.
          pdfToSaveorSubmit = pdf;
        }
      );
    })();

    return () => PSPDFKit && PSPDFKit.unload(container);
  }, []);

  return (
    <>
      <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />
      <button
        onClick={async (e) => {
          e.preventDefault();
          // console.log(await pdfToSaveorSubmit, "pdf");
          if (pdfToSaveorSubmit) {
            // console.log(pdfToSaveorSubmit);
            var blob = new Blob([pdfToSaveorSubmit], {
              type: pdfToSaveorSubmit.mimeType,
            });
            var url = URL.createObjectURL(blob);
            // window.open(url);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `doc.pdf`);
            link.click();
          } else {
            let pdf = await instance.exportPDF();
            var blob = new Blob([pdf], {
              type: pdf.mimeType,
            });
            var url = URL.createObjectURL(blob);
            // window.open(url);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `doc.pdf`);
            link.click();
          }
        }}
      >
        Save updated PDF
      </button>
      <button
        onClick={async (e) => {
          e.preventDefault();
          // console.log(await pdfToSaveorSubmit, "pdf");
          if (pdfToSaveorSubmitFlat) {
            console.log(pdfToSaveorSubmitFlat);
            var blob = new Blob([pdfToSaveorSubmitFlat], {
              type: pdfToSaveorSubmitFlat.mimeType,
            });
            var url = URL.createObjectURL(blob);
            // window.open(url);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `doc.pdf`);
            link.click();
          } else {
            let pdf = await instance.exportPDF({ flatten: true });
            var blob = new Blob([pdf], {
              type: pdf.mimeType,
            });
            var url = URL.createObjectURL(blob);
            // window.open(url);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `doc.pdf`);
            link.click();
          }
        }}
      >
        Save updated PDF (Flatten)
      </button>
    </>
  );
}
