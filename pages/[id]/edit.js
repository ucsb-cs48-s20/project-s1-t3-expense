import { useState, useEffect } from "react";
import fetch from "isomorphic-unfetch";
import { requiredAuth } from "../../utils/ssr";
import Layout from "../../components/Layout";
import Bill from "../../components/Bill";

const EditBill = ({ bills, user }) => {
  /* this sets the form to the most updated version of the bill on the database */

  return (
    <Layout user={user}>
      <div className="form-container">
        <h1>Update Bill</h1>
        <div>
          <Bill
            user={user}
            oldForm={{
              title: bills.title,
              description: bills.description,
              groupSize: bills.groupSize,
              dollarAmount: bills.dollarAmount,
              splitWay: bills.splitWay,
              remainingAmount: bills.remainingAmount,
              paid: bills.paid,
              unique: user.sub,
              members: bills.members,
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const {
    props: { user },
  } = await requiredAuth(context);

  let queryIdBills = context.query.id;
  //const res = await fetch(`http://localhost:3000/api/bills/${queryIdBills}`);
  const res = await fetch(
    `https://cs48-s20-s1-t3-prod.herokuapp.com/api/bills/${queryIdBills}`
  );
  // const res = await fetch(
  //   `https://cs48-s20-s1-t3-qa.herokuapp.com/api/bills/${queryIdBills}`
  // );
  const { data } = await res.json();
  return { props: { bills: data, user: user } };
}

export default EditBill;
