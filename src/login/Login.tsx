import { lazy, useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Input, Switcher, Title, Error, Form } from "../common/auth.styled";
import GithubButton from "./GithubBtn";
import GoogleButton from "./GoogleBtn";

const SparklesCore = lazy(() => import("../common/ui/Sparkles"));

export default function CreateAccount() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        <Title>Log In</Title>
        <Form onSubmit={onSubmit}>
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
            value={loading ? "Loading" : "Log In"}
          />
        </Form>
        {error !== "" && <Error>{error}</Error>}
        <Switcher>
          Don't have an account ?{" "}
          <Link to="/create-account">
            <b>Create one &rarr;</b>
          </Link>
        </Switcher>
        <GithubButton />
        <GoogleButton />
      </div>
    </div>
  );
}
