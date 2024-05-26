import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Input, Switcher, Title, Error, Form } from "../common/auth.styled";
// import GithubButton from "../components/github-btn";
import GoogleButton from "./GoogleBtn";
import { SparklesCore } from "../common/ui/Sparkles";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
  return (
    <div className="h-screen relative w-full flex flex-col items-center justify-center overflow-hidden rounded-md">
      <div className="w-full absolute inset-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={3}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#5eead4"
        />
      </div>
      <div className="z-20 md:w-96 sm:w-80">
        <Title>Sign Up</Title>
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
          <Input
            onChange={onChange}
            type="submit"
            value={loading ? "Loading" : "Create Account"}
          />
        </Form>
        {error !== "" && <Error>{error}</Error>}
        <Switcher>
          Already have an account ?{" "}
          <Link to="/login">
            <b>Log in &rarr;</b>
          </Link>
        </Switcher>
        {/* <GithubButton /> */}
        <GoogleButton />
      </div>
    </div>
  );
}
