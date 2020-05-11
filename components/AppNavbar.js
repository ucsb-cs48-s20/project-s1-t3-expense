import Link from "next/link";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";

function AppNavbar(props) {
  const user = props.user;

  return (
    <Navbar bg="dark" variant="dark" className="Navbar">
      <Container>
        <Link href="/" passHref={true}>
          <Navbar.Brand>
            <i className="fas fa-money-bill"></i> Housing Expenses Splitter
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav className="mr-auto">
            {user ? (
              <Link href="/bill-private" passHref={true}>
                <Nav.Link>My Bills</Nav.Link>
              </Link>
            ) : (
              <Link href="/new-temporary" passHref={true}>
                <Nav.Link>Temporary Bills</Nav.Link>
              </Link>
            )}
          </Nav>
          <Nav>
            {user ? (
              <NavDropdown
                title={
                  <>
                    Hi, {user.name}
                    <Image
                      className="ml-2"
                      src={user.picture}
                      width={24}
                      height={24}
                    />
                  </>
                }
              >
                <NavDropdown.Item
                  className="text-danger"
                  href="/api/logout"
                  variant="dark"
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link data-cy="login" href="/api/login" className="fontColor">
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
