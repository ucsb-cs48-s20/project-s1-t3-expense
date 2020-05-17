import { PDFDownloadLink } from "@react-pdf/renderer";
import BillPDF from "./BillPDF";

function ExportPDF(props) {
  const title = props.bills.title + ".pdf";

  return (
    <div>
      <PDFDownloadLink
        document={<BillPDF bills={props.bills} />}
        fileName={title}
      >
        {({ blob, url, loading, error }) =>
          loading ? "Loading document..." : "Export as a PDF"
        }
      </PDFDownloadLink>
    </div>
  );
}

export default ExportPDF;
