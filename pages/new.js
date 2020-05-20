import { useState, useEffect, Component } from "react";
import fetch from "isomorphic-unfetch";
import Button from "react-bootstrap/Button";
import { Form, Checkbox, Loader, Radio } from "semantic-ui-react";
import { useRouter } from "next/router";
import { requiredAuth } from "../utils/ssr";
import { set } from "mongoose";

const NewBill = ({ user }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    groupSize: 1,
    dollarAmount: 0,
    remainingAmount: 0,
    splitWay: "equal",
    paid: false,
    unique: user.sub,
    members: [{ name: "", cost: 0 }],
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
          dollarAmount: 0,
          remainingAmount: 0,
          splitWay: "equal",
          paid: false,
          unique: user.sub,
          members: [{ name: "", cost: 0 }],
        });
      }
    }
  }, [errors]);

  const calculateRemainingAmount = (e) => {
    let remainingAmount = e;
    form.members.forEach((member) => {
      remainingAmount = remainingAmount - member.cost;
    });
    return remainingAmount;
  };

  const equalCostPerMemberString = () => {
    const costPerMember = (form.dollarAmount / form.groupSize).toFixed(2);
    return form.members?.length > 0 ? costPerMember : "";
  };

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
    let test = [];
    if (form.splitWay === "equal") {
      for (let i = 0; i < form.members.length; i++) {
        test[i] = {
          name: form.members[i].name,
          cost: equalCostPerMemberString(),
        };
      }
      setForm({
        ...form,
        members: test,
      });
    }
    e.preventDefault();
    let errs = validate();
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
    if (e.target.name === "groupSize") {
      for (let i = 0; i < e.target.value; i++) {
        if (form.members[i]) {
          test[i] = { name: form.members[i].name, cost: form.members[i].cost };
        } else {
          test[i] = { name: "", cost: 0 };
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
      remainingAmount: calculateRemainingAmount(e.target.value),
      dollarAmount: e.target.value,
    });
  };

  const handleMemberCost = (e, index) => {
    const newCost = e.target.value;

    const newMemberList = form.members;
    newMemberList[index] = {
      name: newMemberList[index].name,
      cost: e.target.value,
    };

    setForm({
      ...form,
      members: newMemberList,
      remainingAmount: calculateRemainingAmount(form.dollarAmount),
    });
  };

  const handleMemberName = (e, index) => {
    const newName = e.target.value;

    const memberObject = form.members;

    memberObject[index] = {
      name: e.target.value,
      cost: memberObject[index].cost,
    };

    setForm({
      ...form,
      members: memberObject,
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
                      onChange={(e) => {
                        handleMemberName(e, index);
                      }}
                    />
                    {form.splitWay === "equal" ? (
                      equalCostPerMemberString()
                    ) : (
                      <div>
                        <Form.Input
                          name="expense"
                          type="number"
                          step="1"
                          min="0"
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
