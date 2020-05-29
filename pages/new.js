import { Loader } from "semantic-ui-react";
import { requiredAuth } from "../utils/ssr";
import Bill from "../components/Bill";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";

const NewBill = ({ user }) => {
  //  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Layout user={user}>
      <div className="form-container">
        <h1>Create Bill</h1>
        <div>
          <Bill user={user} />
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const {
    props: { user },
  } = await requiredAuth(context);
  return { props: { user: user } };
}
/*
{isSubmitting ? (
  <Loader active inline="centered" />
) : (
  <Bill user={user}/>
)}
*/
export default NewBill;
