import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { FirebaseError } from "firebase/app";

import { Button, Error, Form, Input } from "../../common/login/auth.styled";

const LoginForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (loading || email === "" || password === "") return;
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Input
          onChange={handleChange}
          value={email}
          name="email"
          placeholder="Email"
          type="email"
          required
        />
        <Input
          onChange={handleChange}
          value={password}
          name="password"
          placeholder="Password"
          type="password"
          required
        />
        <Button type="submit">
          <b>{loading ? "Loading" : "Log In"}</b>
        </Button>
      </Form>
      {error !== "" && <Error>{error}</Error>}
    </>
  );
};

export default LoginForm;
