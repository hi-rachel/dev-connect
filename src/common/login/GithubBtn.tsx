import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { Button, Logo } from "./auth.styled";
import { useState } from "react";
import { Error } from "./auth.styled";

const GithubButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleClick = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Button onClick={handleClick}>
        <Logo width={25} height={25} alt="github-logo" src="/github-logo.svg" />
        <b>{loading ? "Connecting" : "Continue with Github"}</b>
      </Button>
      {error !== "" && <Error>{error}</Error>}
    </>
  );
};

export default GithubButton;
