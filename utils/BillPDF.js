import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import TablePDF from "./TablePDF";

function BillPDF(props) {
  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#f2f2f2",
      fontFamily: "Helvetica",
      paddingTop: 30,
    },
    section: {
      margin: 30,
      padding: 10,
    },
    date: {
      flexDirection: "row",
      justifyContent: "flex-end",
      fontSize: 12,
    },
  });

  const date = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.date}>
          <Text style={{ width: 40 }}>Date: </Text>
          <Text>{date}</Text>
        </View>

        <View style={styles.section}>
          <Text
            style={{ fontSize: 24, fontStyle: "bold", textAlign: "center" }}
          >
            {props.bills.title}
          </Text>

          <Text style={{ fontSize: 14, marginTop: 36 }}>
            Group Size: {props.bills.groupSize}
          </Text>

          <Text style={{ fontSize: 14 }}>
            Total Amount: $
            {JSON.parse(props.bills.dollarAmount / 100)?.toFixed(2)}
          </Text>

          <Text style={{ fontSize: 12, textAlign: "center", marginTop: 24 }}>
            {props.bills.description}
          </Text>
        </View>

        <TablePDF bills={props.bills} />
      </Page>
    </Document>
  );
}

export default BillPDF;
