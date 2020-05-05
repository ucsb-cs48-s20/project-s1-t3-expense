import MainLayout from "../components/MainLayout";
import AppFooter from "../components/AppFooter";
import { optionalAuth } from "../utils/ssr";

export const getServerSideProps = optionalAuth;

function HomePage(props) {
  const user = props.user;

  return (
    <MainLayout user={user}>
      {user ? (
        <div>
          You're logged in! Here's what the server knows about you:
          <pre>{JSON.stringify(user, null, "\t")}</pre>
        </div>
      ) : (
        <div className="not-log-in-message">You're not logged in!</div>
      )}
      <AppFooter />
    </MainLayout>
  );
}

export default HomePage;
