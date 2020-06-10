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
  convertMemberCoststoCents,
  centsLeftOver,
  calculateExtraCentCost,
} from "../utils/calculations";
import { validateForm } from "../utils/validateForm";

const NewBill = () => {
  const [form, setForm] = useState({
    title: "",
    groupSize: 1,
    dollarAmount: 0,
    remainingAmount: 0,
    splitWay: "equal",
    members: [{ name: "", cost: 0 }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (isSubmitting) {
      if (Object.keys(errors).length === 0) {
        createBill();
      } else {
        setIsSubmitting(false);
        if (errors.title) {
          setForm({
            ...form,
            title: "",
          });
        }
      }
    }
  }, [errors]);

  const createBill = async () => {
    form.dollarAmount = Math.round(form.dollarAmount * 100);
    form.remainingAmount = Math.round(form.remainingAmount * 100);
    form.members.forEach((member) => {
      member.cost = Math.round(member.cost * 100);
    });
    Cookie.set("form", JSON.stringify(form));
    router.push("/bill-temporary");
  };

  const handleSubmit = (e) => {
    const tempArray = form.members;
    for (let i = 0; i < form.members?.length; i++) {
      let newName = form.members[i].name;
      if (!form.members[i].name) {
        newName = "Member " + (i + 1);
      }
      tempArray[i] = {
        name: newName,
        cost: form.members[i].cost,
        email: form.members[i].email,
      };
    }

    setForm({
      ...form,
      members: tempArray,
    });
    e.preventDefault();
    let errs = validateForm(form.title);
    setErrors(errs);
    setIsSubmitting(true);
    console.log(form.members);
  };

  const handleStyle = (e, { value }) => {
    if (value === "custom") {
      const tempMemberArray = form.members;
      for (let i = 0; i < form.groupSize; i++) {
        tempMemberArray[i] = {
          name: tempMemberArray[i].name,
          cost: 0,
          email: tempMemberArray[i].email,
        };
      }
      setForm({
        ...form,
        members: tempMemberArray,
        splitWay: value,
        remainingAmount: (
          calculateRemainingAmount(
            Math.round(form.dollarAmount * 100),
            convertMemberCoststoCents(form.members)
          ) / 100
        ).toFixed(2),
      });
    }
    if (value === "equal") {
      setForm({
        ...form,
        splitWay: value,
        remainingAmount: 0,
      });
    }
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

  const handleMoney = (e) => {
    setForm({
      ...form,
      remainingAmount: (
        calculateRemainingAmount(
          Math.round(e.target.value * 100),
          convertMemberCoststoCents(form.members)
        ) / 100
      ).toFixed(2),
      dollarAmount: e.target.value,
    });
    if (form.splitWay === "equal") {
      setForm({
        ...form,
        remainingAmount: 0,
        dollarAmount: e.target.value,
      });
    }
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
      remainingAmount: (
        calculateRemainingAmount(
          Math.round(form.dollarAmount * 100),
          convertMemberCoststoCents(form.members)
        ) / 100
      ).toFixed(2),
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

  const handleEvenSplit = (index) => {
    form.members[index] = {
      name: form.members[index].name,
      cost: equalCostPerMemberString(form.dollarAmount, form.groupSize),
      email: form.members[index].email,
    };
    console.log(form.members);
    console.log(form.remainingAmount);
    return form.members[index].cost;
  };

  const handleExtraCent = () => {
    form.members[0] = {
      name: form.members[0].name,
      cost: calculateExtraCentCost(form.dollarAmount, form.groupSize),
      email: form.members[0].email,
    };
    return form.members[0].cost;
    console.log(form.members);
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
                      [
                        /* checks if there is leftover cents in even calculation */
                        centsLeftOver(form.dollarAmount, form.groupSize) !=
                        0 ? (
                          [
                            index === 0 ? (
                              <div>${handleExtraCent()}</div>
                            ) : (
                              <div>${handleEvenSplit(index)}</div>
                            ),
                          ]
                        ) : (
                          <div>${handleEvenSplit(index)}</div>
                        ),
                      ]
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
              <p>Remaining Balance: $0.00</p>
            ) : (
              [
                form.remainingAmount < 0 ? (
                  <p>
                    Remaining Balance: <b>-</b>${Math.abs(form.remainingAmount)}
                  </p>
                ) : (
                  <p>Remaining Balance: ${form.remainingAmount}</p>
                ),
              ]
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

            <Button type="submit">Create</Button>
          </Form>
        )}
      </div>
    </div>
  );
};

export default NewBill;
