import { Button } from "semantic-ui-react";
import Link from "next/link";
// Overide the default error code
function Error({ statusCode }) {
  return (
    <div className="errorPage">
      <p>
        <span className="errorPageStatus">{statusCode}</span> This bill does not
        exist
      </p>
      <Link href="/">
        <Button color="grey">Go Back</Button>
      </Link>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
