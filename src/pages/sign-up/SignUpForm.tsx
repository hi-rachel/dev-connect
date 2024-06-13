import { useState } from "react";
import { Button, Error, Form, Input } from "../../common/login/auth.styled";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FirebaseError } from "firebase/app";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (loading || name === "" || email === "" || password === "") return;
    try {
      setLoading(true);
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(credentials.user, {
        displayName: name,
      });
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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name == "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          value={name}
          name="name"
          placeholder="Name"
          type="text"
        />
        <Input
          onChange={onChange}
          value={email}
          name="email"
          placeholder="Email"
          type="email"
          required
        />
        <Input
          onChange={onChange}
          value={password}
          name="password"
          placeholder="Password"
          type="password"
          required
        />
        <Button type="submit">
          <b>{loading ? "Loading" : "Create Account"}</b>
        </Button>
      </Form>
      {error !== "" && <Error>{error}</Error>}
    </>
  );
};

export default SignUpForm;
