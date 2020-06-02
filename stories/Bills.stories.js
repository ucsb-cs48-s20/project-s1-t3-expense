import React from "react";
import Bill from "../components/Bill";
import { select, text } from "@storybook/addon-knobs";
import { calculateRemainingAmount } from "../utils/calculations";

export default {
  title: "Bill",
  component: Bill,
};

export const createBill = () => {
  const name = text("Name", "Kobe Shavolian");
  const picture = text(
    "Image URL",
    "https://lh3.googleusercontent.com/-uAuWU_PRLpU/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmIzsbursevLemuf8XpouerjR_7NQ/photo.jpg?sz=46"
  );
  const user = { name, picture };

  return <Bill user={user} />;
};

export const updateBill = () => {
  const name = text("Name", "Kobe Shavolian");
  const picture = text(
    "Image URL",
    "https://lh3.googleusercontent.com/-uAuWU_PRLpU/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmIzsbursevLemuf8XpouerjR_7NQ/photo.jpg?sz=46"
  );
  const user = { name, picture };

  let form = {
    title: "Food Bill",
    description: "My most recent food bill",
    groupSize: 2,
    dollarAmount: 50,
    splitWay: "equal",
    remainingAmount: 0,
    paid: false,
    unique: 12345,
    members: [],
  };

  let splitCost = (form.dollarAmount / form.groupSize).toFixed(2);
  form.members = [
    { name: "First Person", cost: splitCost, email: "" },
    { name: "Other Person", cost: splitCost, email: "" },
  ];

  return <Bill user={user} oldForm={form} />;
};
