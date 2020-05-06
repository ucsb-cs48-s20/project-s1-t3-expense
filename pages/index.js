import MainLayout from "../components/MainLayout";
import AppFooter from "../components/AppFooter";
import { optionalAuth } from "../utils/ssr";

export const getServerSideProps = optionalAuth;

function HomePage(props) {
  const user = props.user;

  return (
    <MainLayout user={user}>
      {user ? (
        <div className="log-in-message">You're logged in!</div>
      ) : (
        <div className="log-in-message">You're not logged in!</div>
      )}
      <AppFooter />
    </MainLayout>
  );
}

export default HomePage;
