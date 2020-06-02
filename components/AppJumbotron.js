import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import React from "react";

function AppJumbotron(props) {
  const user = props.user;

  return (
    <Container>
      <Jumbotron fluid variant="" className="Jumbotron">
        <h1 className="myfont">Housing Expenses Splitter</h1>
        <p className="styles.fontColor">
          A web application to keep track of bills and owed money, can support
          payments such as rent or one time fees. Users can choose to split the
          bills evenly or customize by themselves.
        </p>
      </Jumbotron>
      <div className="container">
        <div className="row">
          <div className="col-sm-4">
            <h3>Create And Edit Bills</h3>
            <img src="/images/bill.png" alt="Bill" />
            <p>To keep track of whos paying who as expenses pile up</p>
          </div>
          <div className="col-sm-4">
            <h3>Invite Others To Bills</h3>
            <img src="/images/members.png" alt="Members" />
            <p>To keep everyone posted on whos paying what</p>
          </div>
          <div className="col-sm-4">
            <h3>Export Reciept PDFs</h3>
            <img src="/images/pdflogo.png" alt="PDFlogo" />
            <p>To keep a nice summary of all your bills</p>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default AppJumbotron;
