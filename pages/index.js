import MainLayout from "../components/MainLayout";
import AppFooter from "../components/AppFooter";
import { optionalAuth } from "../utils/ssr";

export const getServerSideProps = optionalAuth;

function HomePage(props) {
  const user = props.user;

  return (
    <MainLayout user={user}>
      <AppFooter />
    </MainLayout>
  );
}

export default HomePage;
