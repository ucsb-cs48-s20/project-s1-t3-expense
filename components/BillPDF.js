import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

function BillPDF(props) {
  return (
    <Document>
      <Page>
        <Text>{props.bills.title}</Text>
        <Text>{props.bills.groupSize}</Text>
        <Text>{props.bills.dollarAmount}</Text>
        <Text>{props.bills.description}</Text>
      </Page>
    </Document>
  );
}

export default BillPDF;
