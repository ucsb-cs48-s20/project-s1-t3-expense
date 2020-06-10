import React from "react";
import TotalAmountOwed from "../components/TotalAmountOwed";
import { select, text } from "@storybook/addon-knobs";

export default {
  title: "TotalAmountOwed",
  component: TotalAmountOwed,
};

export const totalAmountOwed = () => {
  const name = text("Name", "Kobe Shavolian");
  const picture = text(
    "Image URL",
    "https://lh3.googleusercontent.com/-uAuWU_PRLpU/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmIzsbursevLemuf8XpouerjR_7NQ/photo.jpg?sz=46"
  );
  const email = text("User Email", "kobeshavolian@ucsb.edu");
  const user = { name, picture, email };

  let activeBills = [
    {
      title: "Food Bill",
      description: "My most recent food bill",
      groupSize: 1,
      dollarAmount: 50,
      splitWay: "equal",
      remainingAmount: 0,
      paid: false,
      unique: 12345,
      members: [
        {
          name: "First Person",
          cost: parseInt(text("Cost 1", "2500")),
          email: text("Email 1", "kobeshavolian@ucsb.edu"),
        },
      ],
    },
  ];

  return <TotalAmountOwed activeBills={activeBills} user={user} />;
};
