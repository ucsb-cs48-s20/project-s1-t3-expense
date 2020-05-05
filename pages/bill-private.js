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
        <p>Here are your active bills:</p>
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
        <div className="create-new-button">
          <Link href="/new">
            <Button primary>New Bill</Button>
          </Link>
        </div>
      </div>
      <div className="bill-container">
        <p>Here are your paid bills:</p>
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
