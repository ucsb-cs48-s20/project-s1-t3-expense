import Container from "react-bootstrap/Container";
import AppNavbar from "./AppNavbar";
import AppFooter from "./AppFooter";
import AppJumbotron from "./AppJumbotron";
import Head from "next/head";
import React from "react";
// Layout with Jumbotron
function MainLayout(props) {
  const user = props.user;

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
          integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p"
          crossOrigin="anonymous"
        />
      </Head>
      <AppNavbar user={user} />
      {user ? (
        <div className="log-in-message">You're logged in!</div>
      ) : (
        <div className="log-in-message">You're not logged in!</div>
      )}
      <AppJumbotron user={user} />
      <Container>{props.children}</Container>
      <AppFooter />
    </>
  );
}

export default MainLayout;
