import Link from "next/link";
import { useState, useEffect } from "react";
import fetch from "isomorphic-unfetch";
import Button from "react-bootstrap/Button";
import { Form, Loader } from "semantic-ui-react";
import { useRouter } from "next/router";
import { requiredAuth } from "../../utils/ssr";
import Layout from "../../components/Layout";

const EditBill = ({ bills, user }) => {
  const [form, setForm] = useState({
    title: bills.title,
    description: bills.description,
    unique: user.sub,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (isSubmitting) {
      if (Object.keys(errors).length === 0) {
        updateBill();
      } else {
        setIsSubmitting(false);
        setForm({
          title: "",
          description: "",
          unique: user.sub,
        });
      }
    }
  }, [errors]);

  const updateBill = async () => {
    try {
      const res = await fetch(
        //`http://localhost:3000/api/bills/${router.query.id}`,
        `https://cs48-s20-s1-t3-prod.herokuapp.com/api/bills/${router.query.id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );
      router.push("/bill-private");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let errs = validate();
    setErrors(errs);
    setIsSubmitting(true);
  };
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let err = {};

    if (!form.title) {
      err.title = "Title is required";
    } else if (form.title.length > 40) {
      err.title = "Title must be less than 40 characters";
    }
    if (!form.description) {
      err.description = "Description is required";
    } else if (form.description.length > 200) {
      err.description = "Description must be less taht 200 characters";
    }
    return err;
  };

  return (
    <Layout user={user}>
      <div className="form-container">
        <h1>Update Bill</h1>
        <div>
          {isSubmitting ? (
            <Loader active inline="centered" />
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Input
                fluid
                error={
                  errors.title
                    ? {
                        content:
                          "Title must not be empty or longer than 40 characters",
                        pointing: "below",
                      }
                    : null
                }
                label="Title"
                placeholder="Title"
                name="title"
                value={form.title}
                onChange={handleChange}
              />
              <Form.TextArea
                fluid
                error={
                  errors.description
                    ? {
                        content:
                          "Description must not be empty or longer than 200 characters",
                        pointing: "below",
                      }
                    : null
                }
                label="Description"
                placeholder="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
              />
              <Button type="submit">Update</Button>
            </Form>
          )}
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
  const { data } = await res.json();
  return { props: { bills: data, user: user } };
}

export default EditBill;
