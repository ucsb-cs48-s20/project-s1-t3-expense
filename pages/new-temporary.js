import Link from "next/link";
import { useState, useEffect } from "react";
import fetch from "isomorphic-unfetch";
import Button from "react-bootstrap/Button";
import { Form, Checkbox, Loader } from "semantic-ui-react";
import { useRouter } from "next/router";
import { requiredAuth } from "../utils/ssr";
import Cookie from "js-cookie";

const NewBill = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    groupSize: 1,
    dollarAmount: 0.01,
    members: [],
    // paid: false,
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
          members: [],
          // paid: false,
        });
      }
    }
  }, [errors]);

  const createBill = async () => {
    Cookie.set("form", JSON.stringify(form));
    router.push("/bill-temporary");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let errs = validate();
    setErrors(errs);
    setIsSubmitting(true);
  };
  const handleChange = (e) => {
    let test = [];
    if (e.target.name === "groupSize") {
      for (let i = 0; i < e.target.value; i++) {
        if (form.members[i]) test[i] = form.members[i];
        else test[i] = i.toString();
      }
    }
    if (test.length === 0) test = form.members;

    setForm({
      ...form,
      [e.target.name]: e.target.value,
      members: test,
    });
  };
  const handleCheck = (e) => {
    setCheck(!check);
    setForm({
      ...form,
      // ["paid"]: !check,
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

  const handleMem = (e) => {
    let test = form.members;
    test[e.target.placeholder] = e.target.value;
    console.log(test);
    setForm({
      ...form,
      members: test,
    });
  };

  return (
    <div className="form-container">
      <h1>Create Temporary Bill</h1>
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

            <div className="mem-indent">
              {form.members?.map((item, index) => {
                //console.log(index)
                return (
                  <Form.Input
                    key={index}
                    fluid
                    label="Member"
                    placeholder={index}
                    name="members"
                    onChange={handleMem}
                  />
                );
              })}
            </div>

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

            {/* <Form.Checkbox label="Paid?" name="paid" onChange={handleCheck} /> */}

            <Button type="submit">Create</Button>
          </Form>
        )}
      </div>
    </div>
  );
};

export default NewBill;
