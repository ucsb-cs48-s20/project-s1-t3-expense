import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

function BillPDF(props) {
  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#E4E4E4",
      fontFamily: "Helvetica",
      paddingTop: 30,
      paddingLeft: 60,
      paddingRight: 60,
      lineHeight: 1.5,
      flexDirection: "column",
    },
    section: {
      margin: 30,
      padding: 10,
      flexGrow: 1,
      textAlign: "center",
    },
    date: {
      flexDirection: "row",
      justifyContent: "flex-end",
      fontSize: 12,
    },
    body: {
      fontSize: 16,
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
          <Text style={{ fontSize: 24, fontStyle: "bold" }}>
            {props.bills.title}
          </Text>

          <Text style={styles.body}>Group Size: {props.bills.groupSize}</Text>

          <Text style={styles.body}>
            Total Amount: ${JSON.parse(props.bills.dollarAmount)?.toFixed(2)}
          </Text>

          <Text style={styles.body}>
            To split with {props.bills.groupSize} people evenly, everyone pays:
            $
            {(
              JSON.parse(props.bills.dollarAmount) /
              JSON.parse(props.bills.groupSize)
            ).toFixed(2)}
          </Text>

          <Text style={{ fontSize: 12 }}>{props.bills.description}</Text>
        </View>
      </Page>
    </Document>
  );
}

export default BillPDF;
