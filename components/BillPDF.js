import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

function BillPDF(props) {
  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      backgroundColor: "#E4E4E4",
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>{props.bills.title}</Text>
          <Text>Group Size: {props.bills.groupSize}</Text>
          <Text>
            Total Amount: ${JSON.parse(props.bills.dollarAmount)?.toFixed(2)}
          </Text>
          <Text>
            To split with {props.bills.groupSize} people evenly, everyone pays:
            $
            {(
              JSON.parse(props.bills.dollarAmount) /
              JSON.parse(props.bills.groupSize)
            ).toFixed(2)}
          </Text>
          <Text>{props.bills.description}</Text>
        </View>
      </Page>
    </Document>
  );
}

export default BillPDF;
