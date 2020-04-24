import Container from "react-bootstrap/Container";

function AppFooter() {
  return (
    <Container
      style={{
        color: "black",
        textAlign: "center",
        padding: "20px",
        position: "fixed",
        left: "0",
        bottom: "0",
        height: "60px",
        width: "100%",
      }}
    >
      This is an app to help calculate household espenses. Check out the source
      code on{" "}
      <a href="https://github.com/ucsb-cs48-s20/project-s1-t3-expense">
        GitHub
      </a>
      !
    </Container>
  );
}

export default AppFooter;
