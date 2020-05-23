import React from "react";
import Layout from "../components/Layout";
import { text } from "@storybook/addon-knobs";

export default {
  title: "Layout",
  component: Layout,
};

export const simple_layout = () => {
  const name = text("Name", "Kobe Shavolian");
  const picture = text(
    "Image URL",
    "https://lh3.googleusercontent.com/-uAuWU_PRLpU/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmIzsbursevLemuf8XpouerjR_7NQ/photo.jpg?sz=46"
  );
  const user = { name, picture };
  return <Layout user={user} />;
};
