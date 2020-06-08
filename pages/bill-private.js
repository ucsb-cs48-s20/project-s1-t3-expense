import useSWR from "swr";
import Image from "react-bootstrap/Image";
import fetch from "isomorphic-unfetch";
import Link from "next/link";
import Layout from "../components/Layout";
import { requiredAuth } from "../utils/ssr";
import { Card, Button } from "semantic-ui-react";
import { useRouter } from "next/router";
import { getBill } from "./api/bills/index";

const BillPrivate = ({ bills, user }) => {
  /* We must anticipate for different types of bills when
     we get them from the data base (paid/unpaid), so we 
     make an empty array for each possible type, maps through
     the main bills array and assign each main bill to a sub-
     array based on a boolean attribute each bill has
   */
  let paidBills = [];
  let activeBills = [];
  bills?.map((bill) => {
    if (bill.paid) {
      paidBills.push(bill);
    } else if (!bill.paid) {
      activeBills.push(bill);
    }
  });
  return (
    <Layout user={user}>
      <div className="bill-container">
        <h1>Active Bills:</h1>
        <div className="grid wrapper">
          {activeBills?.map((bill) => {
            return (
              <div key={bill._id}>
                <Card>
                  <Card.Content>
                    <Card.Header>
                      <Link href={`/${bill._id}`}>
                        <a>{bill.title}</a>
                      </Link>
                    </Card.Header>
                    <Card.Description>
                      Bill Amount: ${(bill.dollarAmount / 100).toFixed(2)}
                      <Card.Description>
                        Owner: {bill?.members[0].name}
                      </Card.Description>
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <Link href={`/${bill._id}`}>
                      <Button primary>View</Button>
                    </Link>
                    {/* Only show the edit button for the bill owner */}
                    {user.sub === bill.unique ? (
                      <Link href={`/${bill._id}/edit`}>
                        <Button primary>Edit</Button>
                      </Link>
                    ) : null}
                  </Card.Content>
                </Card>
              </div>
            );
          })}
        </div>
        <div className="create-new-button">
          <Link href="/new">
            <Button primary>New Bill</Button>
          </Link>
        </div>
      </div>
      <div className="bill-container">
        <h1>Paid Bills:</h1>
        <div className="grid-wrapper">
          {paidBills?.map((bill) => {
            return (
              <div key={bill._id}>
                <Card>
                  <Card.Content>
                    <Card.Header>
                      <Link href={`/${bill._id}`}>
                        <a>{bill.title}</a>
                      </Link>
                    </Card.Header>
                    <Card.Description>
                      Bill Amount: ${bill.dollarAmount.toFixed(2)}
                      <Card.Description>
                        Number of People Paying Bill: {bill.groupSize}
                      </Card.Description>
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <Link href={`/${bill._id}`}>
                      <Button primary>View</Button>
                    </Link>
                    <Link href={`/${bill._id}/edit`}>
                      <Button primary>Edit</Button>
                    </Link>
                  </Card.Content>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const {
    props: { user },
  } = await requiredAuth(context);
  //const res = await fetch(`https://cs48-s20-s1-t3-prod.herokuapp.com/api/bills`);
  const res = await getBill(user);
  return { props: { bills: JSON.parse(JSON.stringify(res)), user: user } };
}

export default BillPrivate;
