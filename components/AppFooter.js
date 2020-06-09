import Container from "react-bootstrap/Container";
import React from "react";

function AppFooter() {
  return (
    <Container className="app-footer">
      This is an app to help calculate household expenses. Check out the source
      code on{" "}
      <a href="https://github.com/ucsb-cs48-s20/project-s1-t3-expense">
        GitHub
      </a>
      !
    </Container>
  );
}

export default AppFooter;
