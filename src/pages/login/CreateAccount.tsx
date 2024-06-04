import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Suspense, lazy, useState } from "react";
import { auth } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  Input,
  Switcher,
  Title,
  Error,
  Form,
  Button,
  GoLoginOrSignUp,
} from "../../common/auth.styled";
import GithubButton from "./GithubBtn";
import GoogleButton from "./GoogleBtn";
import LoadingScreen from "../../common/loading/LoadingScreen";

const SparklesCore = lazy(() => import("../../common/ui/Sparkles"));

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
        <Suspense fallback={<LoadingScreen />}>
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={1}
            maxSize={15}
            particleDensity={60}
            className="w-full h-full"
            particleColor="#5eead4"
          />
        </Suspense>
      </div>
      <div className="w-96 z-20 p-5">
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
          <Button type="submit">
            <b>{loading ? "Loading" : "Create Account"}</b>
          </Button>
        </Form>
        {error !== "" && <Error>{error}</Error>}
        <Switcher>
          Already have an account ?{" "}
          <Link to="/login">
            <GoLoginOrSignUp>Log in &rarr;</GoLoginOrSignUp>
          </Link>
        </Switcher>
        <GithubButton />
        <GoogleButton />
      </div>
    </div>
  );
}
