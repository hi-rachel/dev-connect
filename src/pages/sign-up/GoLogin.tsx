import { Link } from "react-router-dom";
import { GoLoginOrSignUp, Switcher } from "../../common/login/auth.styled";

const GoLogin = () => {
  return (
    <div>
      <Switcher>
        Already have an account ?{" "}
        <Link to="/login">
          <GoLoginOrSignUp>Log in &rarr;</GoLoginOrSignUp>
        </Link>
      </Switcher>
    </div>
  );
};

export default GoLogin;
