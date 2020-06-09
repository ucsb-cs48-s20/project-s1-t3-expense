import React from "react";
import { Table } from "semantic-ui-react";

export default function BillInfo({ form, user }) {
  return (
    <>
      <h1>{form.title}</h1>
      <h2>Total Amount: ${(form.dollarAmount / 100).toFixed(2)}</h2>
      <h2>
        Remaining Balance:{" "}
        {form?.remainingAmount < 0 ? (
          <>
            <span>-${Math.abs((form?.remainingAmount / 100).toFixed(2))}</span>
            <h4>
              {" "}
              (${Math.abs((form?.remainingAmount / 100).toFixed(2))} was
              overpaid)
            </h4>
          </>
        ) : (
          <span>${(form?.remainingAmount / 100).toFixed(2)} </span>
        )}
      </h2>
      <h1>Members:</h1>

      <Table celled>
        <Table.Header>
          {user !== void 0 ? (
            <Table.Row>
              <Table.HeaderCell className="two wide">Name</Table.HeaderCell>
              <Table.HeaderCell className="one wide">Cost</Table.HeaderCell>
              <Table.HeaderCell className="two wide">Email</Table.HeaderCell>
            </Table.Row>
          ) : (
            <>
              <Table.Row>
                <Table.HeaderCell className="one wide">Name</Table.HeaderCell>
                <Table.HeaderCell className="one wide">Cost</Table.HeaderCell>
              </Table.Row>
            </>
          )}
        </Table.Header>
        <Table.Body>
          {form.members.map((item, index) => {
            let ownerStatus = "";
            if (index === 0) {
              ownerStatus = " (Owner)";
            }
            return (
              <Table.Row key={index}>
                <Table.Cell>
                  {/* remove : when member name is empty */}
                  {item?.name ? (
                    <span>
                      {item?.name} {ownerStatus}
                    </span>
                  ) : (
                    <span>
                      Member {index + 1} {ownerStatus}
                    </span>
                  )}
                </Table.Cell>
                <Table.Cell>
                  ${item?.cost ? (item.cost / 100).toFixed(2) : 0}
                </Table.Cell>
                {user !== void 0 ? (
                  <Table.Cell>
                    {item?.email ? (
                      <span> Email: {item?.email}</span>
                    ) : (
                      <span>(No Email)</span>
                    )}
                  </Table.Cell>
                ) : null}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>

      {form.description !== void 0 ? (
        <h2>Description: {form.description}</h2>
      ) : null}
      {form.paid !== void 0 ? (
        <h2>Paid Status: {form.paid ? "True" : "False"}</h2>
      ) : null}
    </>
  );
}
