import { useState, useEffect, Component } from "react";
import fetch from "isomorphic-unfetch";
import Button from "react-bootstrap/Button";
import { Form, Checkbox, Loader, Radio } from "semantic-ui-react";
import { useRouter } from "next/router";
import { requiredAuth } from "../utils/ssr";
import { set, STATES } from "mongoose";
import {
  equalCostPerMemberString,
  calculateRemainingAmount,
} from "../utils/calculations";
import { validateForm } from "../utils/validateForm";

const NewBill = ({ user }) => {
  /* An empty form is created here to be filled in by the user and eventually become a bill */
  const [form, setForm] = useState({
    title: "",
    description: "",
    groupSize: 1,
    dollarAmount: 0,
    remainingAmount: 0,
    splitWay: "equal",
    paid: false,
    unique: user.sub,
    members: [{ name: "", cost: 0, email: "" }],
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
        /* If we have reached here, then we have an error so we cannot submit
        and we reset the form with the proper error field reset */
        setIsSubmitting(false);
        if (errors.description) {
          /* Here we check if the descrition field isn't
          correct and reset if needed */
          setForm({
            ...form,
            description: "",
          });
        } else if (errors.title) {
          /* Here we check if the title field isn't
        correct and reset if needed */
          setForm({
            ...form,
            title: "",
          });
        }
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
      /* Call sendEmail api for each member*/
      for (let i = 0; i < form.members.length; i++) {
        form.members[i].email
          ? await fetch("api/sendEmail", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: form.title,
                name: form.members[i].name,
                email: form.members[i].email,
                cost: form.members[i].cost,
                sender: user.name,
              }),
            })
          : null;
      }
      router.push("/bill-private");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    let test = [];
    if (form.splitWay === "equal") {
      for (let i = 0; i < form.members.length; i++) {
        test[i] = {
          name: form.members[i].name,
          cost: equalCostPerMemberString(form.dollarAmount, form.groupSize),
          email: form.members[i].email,
        };
      }
      setForm({
        ...form,
        members: test,
      });
    }
    e.preventDefault();
    let errs = validateForm(form.title, form.description);
    setErrors(errs);
    setIsSubmitting(true);
  };

  const handleStyle = (e, { value }) => {
    setForm({
      ...form,
      splitWay: value,
    });
  };

  const handleChange = (e) => {
    let test = [];
    /* If we changed the groupSize field, we then updated the member list to either increase/decrease accordingly */
    if (e.target.name === "groupSize") {
      for (let i = 0; i < e.target.value; i++) {
        if (form.members[i]) {
          /* Here we check if the bill has any value in it or is it null,  if null we set an 'empty' object*/
          test[i] = {
            name: form.members[i].name,
            cost: form.members[i].cost,
            email: form.members[i].email,
          };
        } else {
          test[i] = { name: "", cost: 0, email: "" };
        }
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
      ["paid"]: !check,
    });
  };

  const handleMoney = (e) => {
    setForm({
      ...form,
      remainingAmount: calculateRemainingAmount(e.target.value, form.members),
      dollarAmount: e.target.value,
    });
  };

  const handleMemberCost = (e, index) => {
    const newCost = e.target.value;

    const newMemberList = form.members;
    newMemberList[index] = {
      name: newMemberList[index].name,
      cost: e.target.value,
      email: newMemberList[index].email,
    };

    setForm({
      ...form,
      members: newMemberList,
      remainingAmount: calculateRemainingAmount(
        form.dollarAmount,
        form.members
      ),
    });
  };

  const handleMemberName = (e, index) => {
    const newName = e.target.value;

    const memberObject = form.members;

    memberObject[index] = {
      name: e.target.value,
      cost: memberObject[index].cost,
      email: memberObject[index].email,
    };

    setForm({
      ...form,
      members: memberObject,
    });
  };

  const handleMemberEmail = (e, index) => {
    const memberObject = form.members;

    memberObject[index] = {
      name: memberObject[index].name,
      cost: memberObject[index].cost,
      email: e.target.value,
    };

    setForm({
      ...form,
      members: memberObject,
    });
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
              value={form.title}
              onChange={handleChange}
            />

            <Form.Input
              label="Group Size"
              placeholder="Group amount"
              name="groupSize"
              type="number"
              step="1"
              min="1"
              value={form.groupSize}
              onChange={handleChange}
            />

            <div className="mem-indent">
              {form.members?.map((item, index) => {
                return (
                  <div>
                    <Form.Input
                      key={index}
                      fluid
                      label="Member Name"
                      placeholder={index + 1}
                      name="members"
                      value={form.members[index]?.name}
                      onChange={(e) => {
                        handleMemberName(e, index);
                      }}
                    />
                    <Form.Input
                      key={index}
                      fluid
                      label="Member Email"
                      placeholder={index + 1 + "@gmail.com"}
                      name="emails"
                      onChange={(e) => {
                        handleMemberEmail(e, index);
                      }}
                    />
                    {form.splitWay === "equal" ? (
                      equalCostPerMemberString(
                        form.dollarAmount,
                        form.groupSize
                      )
                    ) : (
                      <div>
                        <Form.Input
                          name="expense"
                          label="Cost"
                          type="number"
                          step="1"
                          min="0"
                          value={form.members[index]?.cost}
                          onChange={(e) => {
                            handleMemberCost(e, index);
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {form.splitWay === "equal" ? (
              <p>Remaining Balance: 0</p>
            ) : (
              <p>Remaining Balance: {form.remainingAmount}</p>
            )}

            <Form.Input
              label="Total Amount"
              placeholder="Enter amount"
              name="dollarAmount"
              type="number"
              step="0.01"
              min="0.01"
              value={form.dollarAmount}
              onChange={handleMoney}
            />

            <Form.Group inline>
              <label>Split Method</label>
              <Form.Field
                name="splitWay"
                control={Radio}
                label="Equal"
                value="equal"
                checked={form.splitWay === "equal"}
                onChange={handleStyle}
              />
              <Form.Field
                name="splitWay"
                control={Radio}
                label="Custom"
                value="custom"
                checked={form.splitWay === "custom"}
                onChange={handleStyle}
              />
            </Form.Group>

            <Form.TextArea
              fluid="true"
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
              value={form.description}
              name="description"
              onChange={handleChange}
            />

            <Form.Checkbox
              label="Paid?"
              name="paid"
              value={form.paid}
              onChange={handleCheck}
            />

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
