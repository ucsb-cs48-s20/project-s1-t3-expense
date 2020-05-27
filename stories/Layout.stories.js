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
  return (
    <>
      <link
        rel="stylesheet"
        href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
        integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p"
        crossOrigin="anonymous"
      />
      <Layout user={user} />
    </>
  );
};
