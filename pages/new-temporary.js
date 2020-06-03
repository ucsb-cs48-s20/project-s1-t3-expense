import Link from "next/link";
import { useState, useEffect } from "react";
import fetch from "isomorphic-unfetch";
import Button from "react-bootstrap/Button";
import { Form, Checkbox, Loader, Radio } from "semantic-ui-react";
import { useRouter } from "next/router";
import { requiredAuth } from "../utils/ssr";
import Cookie from "js-cookie";
import {
  equalCostPerMemberString,
  calculateRemainingAmount,
} from "../utils/calculations";
import { validateForm } from "../utils/validateForm";

const NewBill = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    groupSize: 1,
    dollarAmount: 0,
    remainingAmount: 0,
    splitWay: "equal",
    paid: false,
    members: [{ name: "", cost: 0 }],
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
        if (errors.description) {
          setForm({
            ...form,
            description: "",
          });
        } else if (errors.title) {
          setForm({
            ...form,
            title: "",
          });
        }
      }
    }
  }, [errors]);

  const createBill = async () => {
    form.dollarAmount = Math.floor(form.dollarAmount * 100);
    form.remainingAmount = Math.floor(form.remainingAmount * 100);
    form.members.forEach((member) => {
      member.cost = Math.floor(member.cost * 100);
    });
    Cookie.set("form", JSON.stringify(form));
    router.push("/bill-temporary");
  };

  const handleSubmit = (e) => {
    let test = [];
    if (form.splitWay === "equal") {
      for (let i = 0; i < form.members.length; i++) {
        test[i] = {
          name: form.members[i].name,
          cost: (
            equalCostPerMemberString(
              Math.floor(form.dollarAmount * 100),
              form.groupSize
            ) / 100
          ).toFixed(2),
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
      // ["paid"]: !check,
    });
  };

  const handleMoney = (e) => {
    form.members.forEach((member) => {
      member.cost = Math.floor(member.cost * 100);
    });
    setForm({
      ...form,
      remainingAmount: (
        calculateRemainingAmount(
          Math.floor(e.target.value * 100),
          form.members
        ) / 100
      ).toFixed(2),
      dollarAmount: e.target.value,
    });
    form.members.forEach((member) => {
      member.cost = (member.cost / 100).toFixed(2);
    });
  };

  const handleMemberCost = (e, index) => {
    const newCost = e.target.value;

    const newMemberList = form.members;
    newMemberList[index] = {
      name: newMemberList[index].name,
      cost: e.target.value,
    };

    form.members.forEach((member) => {
      member.cost = Math.floor(member.cost * 100);
    });
    setForm({
      ...form,
      members: newMemberList,
      remainingAmount: (
        calculateRemainingAmount(
          Math.floor(form.dollarAmount * 100),
          form.members
        ) / 100
      ).toFixed(2),
    });
    form.members.forEach((member) => {
      member.cost = (member.cost / 100).toFixed(2);
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
              value={form.title}
              onChange={handleChange}
            />

            <Form.Input
              label="Group Size"
              placeholder="Enter group size..."
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
                    {form.splitWay === "equal" ? (
                      (
                        equalCostPerMemberString(
                          Math.floor(form.dollarAmount * 100),
                          form.groupSize
                        ) / 100
                      ).toFixed(2)
                    ) : (
                      <div>
                        <Form.Input
                          label="Cost"
                          name="expense"
                          type="number"
                          step="0.01"
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
              name="description"
              value={form.description}
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
