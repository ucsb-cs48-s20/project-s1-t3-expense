import { PDFDownloadLink } from "@react-pdf/renderer";
import BillPDF from "./BillPDF";

function ExportPDF(props) {
  return (
    <div>
      <PDFDownloadLink
        document={<BillPDF bills={props.bills} />}
        fileName="Bill.pdf"
      >
        {({ blob, url, loading, error }) =>
          loading ? "Loading document..." : "Export as a PDF"
        }
      </PDFDownloadLink>
    </div>
  );
}

export default ExportPDF;
