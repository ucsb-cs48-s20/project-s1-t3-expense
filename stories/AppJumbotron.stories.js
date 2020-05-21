import React from "react";
import { select, text } from "@storybook/addon-knobs";
import AppJumbotron from "../components/AppJumbotron";

export default {
  title: "AppJumbotron",
  component: AppJumbotron,
};

export const appJumbotron = () => {
  return <AppJumbotron />;
};
