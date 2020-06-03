import React from "react";
import { Icon, Label, Menu, Table, TableBody } from "semantic-ui-react";

export default function BillInfo({ form }) {
  return (
    <>
      <h1>{form.title}</h1>
      <h4>Total Amount: ${form.dollarAmount?.toFixed(2)}</h4>
      <h4>Remaining Balance: ${form?.remainingAmount.toFixed(2)}</h4>
      <h4>Members:</h4>

      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Cost</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {form.members.map((item, index) => {
            return (
              <Table.Row key={index}>
                <Table.Cell>
                  {/* remove : when member name is empty */}
                  {item?.name ? (
                    <span>{item?.name} </span>
                  ) : (
                    <span>Member {index + 1} </span>
                  )}
                </Table.Cell>
                <Table.Cell>${item?.cost ? item.cost : 0}</Table.Cell>
                <Table.Cell>
                  {item?.email ? (
                    <span> Email: {item?.email}</span>
                  ) : (
                    <span>(No Email)</span>
                  )}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>

      <h2>Description: {form.description}</h2>
      <h2>Paid Status: {form.paid?.toString()}</h2>
    </>
  );
}
