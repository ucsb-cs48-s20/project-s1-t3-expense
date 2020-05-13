import Link from "next/link";
import { useState, useEffect } from "react";
import fetch from "isomorphic-unfetch";
import Button from "react-bootstrap/Button";
import { Form, Checkbox, Loader } from "semantic-ui-react";
import { useRouter } from "next/router";
import { requiredAuth } from "../utils/ssr";
import Layout from "../components/Layout";

const NewBill = ({ user }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    groupSize: 1,
    dollarAmount: 0.01,
    paid: false,
    unique: user.sub,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [check, setCheck] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isSubmitting) {
      if (Object.keys(errors).length === 0) {
        createBill();
      } else {
        setIsSubmitting(false);
        setForm({
          title: "",
          description: "",
          groupSize: 1,
          dollarAmount: 0.01,
          paid: false,
          unique: user.sub,
        });
      }
    }
  }, [errors]);

  const createBill = async () => {
    try {
      const res = await fetch("api/bills", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
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
  const handleCheck = (e) => {
    setCheck(!check);
    setForm({
      ...form,
      ["paid"]: !check,
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
      err.description = "Description must be less than 200 characters";
    }
    return err;
  };

  return (
    <div className="form-container">
      <h1>Create Bill</h1>
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
              onChange={handleChange}
            />

            <Form.Input
              label="Group Size"
              placeholder="Enter group size..."
              name="groupSize"
              type="number"
              step="1"
              min="1"
              onChange={handleChange}
            />

            <Form.Input
              label="Amount"
              placeholder="Enter amount"
              name="dollarAmount"
              type="number"
              step="0.01"
              min="0.01"
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
              onChange={handleChange}
            />

            <Form.Checkbox label="Paid?" name="paid" onChange={handleCheck} />

            <Button type="submit">Create</Button>
          </Form>
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const {
    props: { user },
  } = await requiredAuth(context);
  return { props: { user: user } };
}

export default NewBill;
