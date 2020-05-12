import fetch from "isomorphic-unfetch";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Confirm, Button, Loader } from "semantic-ui-react";
import Layout from "../components/Layout";
import Link from "next/link";
import Cookie from "js-cookie";
import cookie from "cookie";

const BillTemporary = ({ bills }) => {
  const [confirm, setConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isDeleting) {
      deleteBill();
    }
  }, [isDeleting]);

  const open = () => {
    setConfirm(true);
  };

  const close = () => {
    setConfirm(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    close();
  };

  const deleteBill = async () => {
    Cookie.remove("form");
    router.push("/");
  };

  // let paidStatus;
  // if (bills.paid) {
  //   paidStatus = "Paid";
  // } else if (!bills.paid) {
  //   paidStatus = "Not Paid";
  // }

  return (
    <Layout user={null}>
      <div className="bill-container">
        {isDeleting ? (
          <Loader active />
        ) : (
          <>
            <h1>{bills.title}</h1>
            <h4>Group Size: {bills.groupSize}</h4>
            <h4>Total Amount: ${JSON.parse(bills.dollarAmount)?.toFixed(2)}</h4>
            <h5>
              To split with {bills.groupSize} people evenly, everyone pays: $
              {(
                JSON.parse(bills.dollarAmount) / JSON.parse(bills.groupSize)
              ).toFixed(2)}
            </h5>
            <p>{bills.description}</p>
            {/* <p>Paid Status: {paidStatus}</p> */}
            <Button color="red" onClick={open}>
              Delete
            </Button>
          </>
        )}
        <Confirm open={confirm} onCancel={close} onConfirm={handleDelete} />
      </div>
    </Layout>
  );
};

BillTemporary.getInitialProps = ({ req }) => {
  const cookies = parseCookies(req);
  return {
    bills: JSON.parse(cookies.form),
  };
};

function parseCookies(req) {
  return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
}
export default BillTemporary;
