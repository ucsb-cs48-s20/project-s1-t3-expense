import React, { Fragment } from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

function TablePDF({ bills }) {
  const styles = StyleSheet.create({
    table: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 6,
      borderWidth: 1,
      borderColor: "#404040",
    },
    container: {
      flexDirection: "row",
      borderBottomColor: "#404040",
      borderBottomWidth: 1,
      alignItems: "center",
      height: 24,
      fontStyle: "bold",
    },
    member: {
      width: "75%",
      borderRightColor: "#1a1a1a",
      borderRightWidth: 1,
    },
    amount: {
      width: "25%",
    },
  });

  const rows = bills.members.map((mem, index) => (
    <View style={styles.container} key={index}>
      <Text
        style={[
          styles.member,
          { textAlign: "left", paddingLeft: 8, fontSize: 14 },
        ]}
      >
        {mem.name}
      </Text>
      <Text
        style={[
          styles.amount,
          { textAlign: "right", paddingRight: 8, fontSize: 14 },
        ]}
      >
        ${mem.cost}
      </Text>
    </View>
  ));

  return (
    <View style={styles.table}>
      <View
        style={[
          styles.container,
          { textAlign: "center", backgroundColor: "#404040" },
        ]}
      >
        <Text style={[styles.member, { color: "white" }]}>Member</Text>
        <Text style={[styles.amount, { color: "white" }]}>Amount</Text>
      </View>

      <Fragment>{rows}</Fragment>
    </View>
  );
}

export default TablePDF;
