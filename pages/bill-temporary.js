import fetch from "isomorphic-unfetch";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Confirm, Button, Loader } from "semantic-ui-react";
import Layout from "../components/Layout";
import Link from "next/link";
import Cookie from "js-cookie";
import cookie from "cookie";
import dynamic from "next/dynamic";
const ExportPDF = dynamic(() => import("../components/ExportPDF"), {
  ssr: false,
});

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
            <h4>Total Amount: ${(bills.dollarAmount / 100).toFixed(2)}</h4>
            <h4>
              Remaining Balance: ${(bills.remainingAmount / 100).toFixed(2)}
            </h4>
            <h4>Members:</h4>
            {bills.members?.map((mem, index) => {
              return (
                <p key={index}>
                  {mem.name} : ${(mem.cost / 100).toFixed(2)}
                </p>
              );
            })}
            <p>{bills.description}</p>
            <Button color="red" onClick={open}>
              Delete
            </Button>
            <ExportPDF bills={bills} />
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
