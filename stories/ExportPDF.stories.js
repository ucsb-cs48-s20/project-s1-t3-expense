import React from "react";
import ExportPDF from "../components/ExportPDF";
import { text } from "@storybook/addon-knobs";

export default {
  title: "ExportPDF",
  component: ExportPDF,
};

export const exportPDF = () => {
  let bills = {
    title: text("Title", "Bill Title"),
    description: text("Description", "Bill Description"),
    groupSize: parseInt(text("Total group size", "3")),
    dollarAmount: parseInt(text("Total dollar amount", "10")),
    members: [text("Name 1", "First Person"), text("Name 2", "Other Person")],
  };
  return <ExportPDF bills={bills} />;
};
