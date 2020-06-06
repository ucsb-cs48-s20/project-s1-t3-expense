import fetch from "isomorphic-unfetch";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Confirm, Button, Loader } from "semantic-ui-react";
import { requiredAuth } from "../../utils/ssr";
import Layout from "../../components/Layout";
import Link from "next/link";
import dynamic from "next/dynamic";
import BillInfo from "../../components/BillInfo";
const ExportPDF = dynamic(() => import("../../components/ExportPDF"), {
  ssr: false,
});

const Bills = ({ bills, user }) => {
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
    const billId = router.query.id;
    try {
      const deleted = await fetch(
        // `http://localhost:3000/api/bills/${billId}`,
        // `https://cs48-s20-s1-t3-prod.herokuapp.com/api/bills/${billId}`,
        `https://cs48-s20-s1-t3-qa.herokuapp.com/api/bills/${billId}`,
        {
          method: "DELETE",
        }
      );

      router.push("/bill-private");
    } catch (error) {
      console.log(error);
    }
  };

  let paidStatus;
  if (bills.paid) {
    paidStatus = "Paid";
  } else if (!bills.paid) {
    paidStatus = "Not Paid";
  }

  return (
    <Layout user={user}>
      <div className="bill-container">
        {isDeleting ? (
          <Loader active />
        ) : (
          <>
            <BillInfo form={bills} user={user} />
            {/* When the user is not the bill owner, they cannot delete the bill */}
            {bills.unique === user.sub ? (
              <Button color="red" onClick={open}>
                Delete
              </Button>
            ) : null}
            <Link href="/bill-private">
              <Button color="grey">Go Back</Button>
            </Link>
            <ExportPDF bills={bills} />
          </>
        )}
        <Confirm open={confirm} onCancel={close} onConfirm={handleDelete} />
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const {
    props: { user },
  } = await requiredAuth(context);

  let queryIdBills = context.query.id;
  // const res = await fetch(`http://localhost:3000/api/bills/${queryIdBills}`);
  // const res = await fetch(
  //   `https://cs48-s20-s1-t3-prod.herokuapp.com/api/bills/${queryIdBills}`
  // );
  const res = await fetch(
    `https://cs48-s20-s1-t3-qa.herokuapp.com/api/bills/${queryIdBills}`
  );
  const { data } = await res.json();
  return { props: { bills: data, user: user } };
}
export default Bills;
