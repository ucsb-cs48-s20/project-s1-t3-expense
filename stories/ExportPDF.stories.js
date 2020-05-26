import React from "react";
import ExportPDF from "../components/ExportPDF";
import { select, text } from "@storybook/addon-knobs";

export default {
  title: "ExportPDF",
  component: ExportPDF,
};

export const exportPDF = () => {
  const splitType = select("Split Type", ["equal", "custom"], "equal");

  let bills = {
    title: text("Title", "Bill Title"),
    description: text("Description", "Bill Description"),
    groupSize: parseInt(text("Total group size", "3")),
    dollarAmount: parseInt(text("Total dollar amount", "10")),
    members: [],
  };

  if (splitType === "equal") {
    let splitCost = (bills.dollarAmount / bills.groupSize).toFixed(2);
    bills.members = [
      { name: text("Name 1", "First Person"), cost: splitCost },
      { name: text("Name 2", "Other Person"), cost: splitCost },
    ];
  } else {
    bills.members = [
      {
        name: text("Name 1", "First Person"),
        cost: parseFloat(text("Cost 1", "0")).toFixed(2),
      },
      {
        name: text("Name 2", "Other Person"),
        cost: parseFloat(text("Cost 2", "0")).toFixed(2),
      },
    ];
  }

  return <ExportPDF bills={bills} />;
};
