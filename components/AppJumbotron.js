import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";

function AppJumbotron(props) {
  const user = props.user;

  return (
    <Container>
      <Jumbotron fluid variant="" className="Jumbotron">
        <h1>Housing Expenses Splitter</h1>
        <p className="styles.fontColor">
          A web application to keep track of bills and owed money, can support
          payments such as rent or one time fees. Users can choose to split the
          bills evenly or customize by themselves.
        </p>
      </Jumbotron>
    </Container>
  );
}

export default AppJumbotron;
