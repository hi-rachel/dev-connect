import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { Button, Logo } from "./auth.styled";
import { useState } from "react";
import { Error } from "./auth.styled";

const GoogleButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleClick = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
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
        <Logo width={25} height={25} alt="google-logo" src="/google-logo.svg" />
        <b>{loading ? "Connecting" : "Continue with Google"}</b>
      </Button>
      {error !== "" && <Error>{error}</Error>}
    </>
  );
};

export default GoogleButton;
