import { GoLoginOrSignUp, Switcher } from "../../common/login/auth.styled";
import { Link } from "react-router-dom";

const GoSignUp = () => {
  return (
    <Switcher>
      Don't have an account ?{" "}
      <Link to="/create-account">
        <GoLoginOrSignUp>Create one &rarr;</GoLoginOrSignUp>
      </Link>
    </Switcher>
  );
};

export default GoSignUp;
