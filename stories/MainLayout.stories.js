import React from "react";
import MainLayout from "../components/MainLayout";
import { text } from "@storybook/addon-knobs";

export default {
  title: "MainLayout",
  component: MainLayout,
};

export const loggedOut = () => {
  return <MainLayout />;
};
export const loggedIn = () => {
  const name = text("Name", "Kobe Shavolian");
  const picture = text(
    "Image URL",
    "https://lh3.googleusercontent.com/-uAuWU_PRLpU/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmIzsbursevLemuf8XpouerjR_7NQ/photo.jpg?sz=46"
  );
  const user = { name, picture };
  return <MainLayout user={user} />;
};
