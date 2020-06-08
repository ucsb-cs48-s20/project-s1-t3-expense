import { useState, useEffect } from "react";
import fetch from "isomorphic-unfetch";
import { useRouter } from "next/router";
import { Form, Loader, Radio } from "semantic-ui-react";
import {
  equalCostPerMemberString,
  calculateRemainingAmount,
  convertMemberCoststoCents,
} from "../utils/calculations";
import { validateForm } from "../utils/validateForm";
import Button from "react-bootstrap/Button";

export default function Bill(props) {
  const user = props.user;
  const [isSubmitting, setIsSubmitting] = useState(false);
  /* Depending on whether a previous form is passed through or not, we either use the
  previous form (update a bill) or create a brand new one (create a bill) */
  const [form, setForm] = useState(
    props.oldForm
      ? props.oldForm
      : {
          title: "",
          description: "",
          groupSize: 1,
          dollarAmount: 0,
          remainingAmount: 0,
          splitWay: "equal",
          paid: false,
          unique: user.sub,
          // The initial name is set to be user's first name, email is user's login email
          members: [
            { name: user.name.split(" ")[0], cost: 0, email: user.email },
          ],
        }
  );
  const [newBill, setIsNewBill] = useState(props.oldForm ? false : true);
  const [errors, setErrors] = useState({});
  const [check, setCheck] = useState(form.paid);
  const [prevMembers, setPrevMembers] = useState(
    JSON.parse(JSON.stringify(form.members))
  );
  const router = useRouter();

  useEffect(() => {
    if (isSubmitting) {
      if (Object.keys(errors)?.length === 0) {
        {
          newBill ? createBill() : updateBill();
        }
      } else {
        /* If we have reached here, then we have an error so we cannot submit
        and we reset the form with the proper error field reset */
        setIsSubmitting(!isSubmitting);
        if (errors.description) {
          /* Here we check if the description field isn't
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

  const updateBill = async () => {
    /* Try catch here to try and updated the changed we made to the bill on the database */
    try {
      form.dollarAmount = Math.floor(form.dollarAmount * 100);
      form.remainingAmount = Math.floor(form.remainingAmount * 100);
      form.members.forEach((member) => {
        member.cost = Math.floor(member.cost * 100);
      });
      const res = await fetch(
        `http://localhost:3000/api/bills/${router.query.id}`,
        //`https://cs48-s20-s1-t3-prod.herokuapp.com/api/bills/${router.query.id}`,
        // `https://cs48-s20-s1-t3-qa.herokuapp.com/api/bills/${router.query.id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );
      /* Call sendEmail api for each member
         Notifications will be resent when either email is updated or 
         the amount for the member is updated */
      // Loop from index 1 to avoid send notification to bill owner
      for (let i = 1; i < form.members?.length; i++) {
        (form.members[i].email &&
          prevMembers?.length > i &&
          (prevMembers[i].email !== form.members[i].email ||
            prevMembers[i].cost !== form.members[i].cost)) ||
        prevMembers?.length <= i
          ? await fetch(
              `http://localhost:3000/api/sendEmail`,
              //`https://cs48-s20-s1-t3-prod.herokuapp.com/api/sendEmail`,
              // `https://cs48-s20-s1-t3-qa.herokuapp.com/api/sendEmail`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  title: form.title,
                  name: form.members[i].name,
                  email: form.members[i].email,
                  cost: (form.members[i].cost / 100).toFixed(2),
                  sender: user.name,
                  // Send a different email when the amount is changed
                  amountChanged:
                    prevMembers?.length > i
                      ? prevMembers[i].cost !== form.members[i].cost
                      : false,
                }),
              }
            )
          : null;
      }
      /* After the bill is posted, we route the user to the home bill page */
      router.push("/bill-private");
    } catch (error) {
      console.log(error);
    }
  };

  const createBill = async () => {
    /* Try to post the bill, and send emails if the member has the form field filled out */
    try {
      form.dollarAmount = Math.floor(form.dollarAmount * 100);
      form.remainingAmount = Math.floor(form.remainingAmount * 100);
      form.members.forEach((member) => {
        member.cost = Math.floor(member.cost * 100);
      });
      const res = await fetch("api/bills", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      /* Avoid send notification to the bill owner */
      for (let i = 1; i < form.members?.length; i++) {
        form.members[i].email
          ? await fetch("api/sendEmail", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: form.title,
                name: form.members[i].name,
                email: form.members[i].email,
                cost: (form.members[i].cost / 100).toFixed(2),
                sender: user.name,
              }),
            })
          : null;
      }
      /* User is then routed to the bill-private page if there are no errors thrown */
      router.push("/bill-private");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    /* We validate the form by checking if title/description is empty or too long */
    let errs = validateForm(form.title, form.description);
    setErrors(errs);
    setIsSubmitting(true);
    console.log(form.members);
  };

  const handleMoney = (e) => {
    /* We calculate the remaining amount based off assumption that it is custom split,
    then if it is equal then we set remaining amount to 0 */
    setForm({
      ...form,
      remainingAmount: (
        calculateRemainingAmount(
          Math.floor(e.target.value * 100),
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

  /* Find member index in member array, and change cost of individual member */
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
      remainingAmount: (
        calculateRemainingAmount(
          Math.floor(form.dollarAmount * 100),
          convertMemberCoststoCents(form.members)
        ) / 100
      ).toFixed(2),
    });
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
            Math.floor(form.dollarAmount * 100),
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
    let tempMemberArray = [];
    /* If we changed the groupSize field, we then updated the member list to either increase/decrease accordingly */
    if (e.target.name === "groupSize") {
      for (let i = 0; i < e.target.value; i++) {
        if (form.members[i]) {
          /* Here we check if the bill has any value in it or is it null,  if null we set an 'empty' object*/
          tempMemberArray[i] = {
            name: form.members[i].name,
            cost: form.members[i].cost,
            email: form.members[i].email,
          };
        } else {
          tempMemberArray[i] = { name: "", cost: 0, email: "" };
        }
      }
    }
    if (tempMemberArray?.length === 0) tempMemberArray = form.members;

    setForm({
      ...form,
      [e.target.name]: e.target.value,
      members: tempMemberArray,
    });
  };

  /* If the checkbox is clicked, then the boolean is flipped compared to
  whatever is was before and updated */
  const handleCheck = (e) => {
    setCheck(!check);
    setForm({
      ...form,
      paid: !check,
    });
  };

  /* Same as handleMemberCost but with names */
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

  /* Same as handleMemberCost but with emails */
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

  const extraCent = () => {
    let extra =
      form.dollarAmount -
      (form.dollarAmount / form.groupSize).toFixed(2) * form.groupSize;
    let x = (form.dollarAmount / form.groupSize + extra).toFixed(2);
    let cost = Math.floor(x * 100) / 100;
    form.members[0] = {
      name: form.members[0].name,
      cost: cost ? cost : 0,
      email: form.members[0].email,
    };
    return form.members[0].cost.toFixed(2);
  };

  const evenSplit = (index) => {
    form.members[index] = {
      name: form.members[index].name,
      cost: (
        equalCostPerMemberString(form.dollarAmount * 100, form.groupSize) / 100
      ).toFixed(2),
      email: form.members[index].email,
    };
    return form.members[index].cost;
  };

  return (
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
                <div key={index}>
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
                    key={index - form.members?.length}
                    fluid
                    label="Member Email"
                    placeholder={index + 1 + "@gmail.com"}
                    name="emails"
                    onChange={(e) => {
                      handleMemberEmail(e, index);
                    }}
                    value={form.members[index]?.email}
                  />
                  {form.splitWay === "equal" ? (
                    [
                      form.dollarAmount -
                        equalCostPerMemberString(
                          form.dollarAmount,
                          form.groupSize
                        ) *
                          form.groupSize !=
                      0
                        ? [index === 0 ? extraCent() : evenSplit(index)]
                        : evenSplit(index),
                    ]
                  ) : (
                    <div>
                      <Form.Input
                        key={2 * (index + 1 + form.members?.length)}
                        name="expense"
                        label="Cost"
                        type="number"
                        step=".01"
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
            <p>Remaining Balance: ${form.remainingAmount}</p>
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
            value={form.paid?.toString()}
            checked={form.paid}
            onChange={handleCheck}
          />

          {newBill ? (
            <Button type="submit">Create</Button>
          ) : (
            <Button type="submit">Update</Button>
          )}
        </Form>
      )}
    </div>
  );
}
