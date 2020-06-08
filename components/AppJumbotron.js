import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import React from "react";

function AppJumbotron(props) {
  const user = props.user;

  return (
    <Container>
      <Jumbotron fluid variant="" className="Jumbotron">
        <h1 className="jumboFont">Housing Expenses Splitter</h1>
        <p className="jumboText">A web application to keep track of bills</p>
      </Jumbotron>
      <div className="container">
        <div className="row">
          <div className="col-sm-4">
            <h3>Create, Edit, And Save Bills</h3>
            <img src="/images/bill.png" alt="Bill" className="center" />
            <p className="center-text">
              Create a quick temporary bill to sort out whos paying who fast, or
              log in to create multiple bills that are saved onto your account
            </p>
          </div>
          <div className="col-sm-4">
            <h3>Invite Others To Bills</h3>
            <img src="/images/members.png" alt="Members" className="center" />
            <p className="center-text">
              If you're logged in, invite others to your bill so everyone is on
              the same page
            </p>
          </div>
          <div className="col-sm-4">
            <h3>Export Reciept PDFs</h3>
            <img src="/images/pdflogo.png" alt="PDFlogo" className="center" />
            <p className="center-text">
              For when you need a nice summary of your bill
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default AppJumbotron;
