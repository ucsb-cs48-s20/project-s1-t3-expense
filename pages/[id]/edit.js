import { useState, useEffect } from "react";
import fetch from "isomorphic-unfetch";
import Button from "react-bootstrap/Button";
import { Form, Checkbox, Loader, Radio } from "semantic-ui-react";
import { useRouter } from "next/router";
import { requiredAuth } from "../../utils/ssr";
import Layout from "../../components/Layout";

const EditBill = ({ bills, user }) => {
  const [form, setForm] = useState({
    title: bills.title,
    description: bills.description,
    groupSize: bills.groupSize,
    dollarAmount: bills.dollarAmount,
    splitWay: bills.splitWay,
    remainingAmount: bills.remainingAmount,
    paid: bills.paid,
    unique: user.sub,
    members: bills.members,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [check, setCheck] = useState(form.paid);
  const router = useRouter();
  const [prevMembers, setPrevMembers] = useState(
    JSON.parse(JSON.stringify(bills.members))
  );

  useEffect(() => {
    if (isSubmitting) {
      if (Object.keys(errors).length === 0) {
        updateBill();
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
          members: [{ name: "", cost: 0, email: "" }],
        });
      }
    }
  }, [errors]);

  const updateBill = async () => {
    try {
      const res = await fetch(
        // `http://localhost:3000/api/bills/${router.query.id}`,
        // `https://cs48-s20-s1-t3-prod.herokuapp.com/api/bills/${router.query.id}`,
        `https://cs48-s20-s1-t3-qa.herokuapp.com/api/bills/${router.query.id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );
      for (let i = 0; i < form.members.length; i++) {
        form.members[i].email &&
        prevMembers.length > i &&
        prevMembers[i].email !== form.members[i].email
          ? await fetch(
              // `http://localhost:3000/api/sendEmail`,
              // `https://cs48-s20-s1-t3-prod.herokuapp.com/api/sendEmail`,
              `https://cs48-s20-s1-t3-qa.herokuapp.com/api/sendEmail`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  title: form.title,
                  name: form.members[i].name,
                  email: form.members[i].email,
                  cost: form.members[i].cost,
                  sender: user.name,
                }),
              }
            )
          : null;
      }
      router.push("/bill-private");
    } catch (error) {
      console.log(error);
    }
  };

  const equalCostPerMemberString = () => {
    const costPerMember = (form.dollarAmount / form.groupSize).toFixed(2);
    return form.members?.length > 0 ? costPerMember : "";
  };

  const calculateRemainingAmount = (e) => {
    let remainingAmount = e;
    form.members.forEach((member) => {
      remainingAmount = remainingAmount - member.cost;
    });
    return remainingAmount;
  };

  const handleSubmit = (e) => {
    let test = [];
    if (form.splitWay === "equal") {
      for (let i = 0; i < form.members.length; i++) {
        test[i] = {
          name: form.members[i].name,
          cost: equalCostPerMemberString(),
          email: form.members[i].email,
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
      email: newMemberList[index].email,
    };

    setForm({
      ...form,
      members: newMemberList,
      remainingAmount: calculateRemainingAmount(form.dollarAmount),
    });
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
          test[i] = {
            name: form.members[i].name,
            cost: form.members[i].cost,
            email: form.members.email,
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
                        label="Member"
                        placeholder={index + 1}
                        name="members"
                        onChange={(e) => {
                          handleMemberName(e, index);
                        }}
                        value={form.members[index].name}
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
                        value={form.members[index].email}
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
                            value={form.members[index].cost}
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

              <Form.Checkbox
                label="Paid?"
                name="paid"
                checked={check}
                onChange={handleCheck}
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

export default EditBill;
