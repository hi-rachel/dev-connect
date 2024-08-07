import { Suspense, lazy } from "react";
import {
  Container,
  ContentWrapper,
  FullPageWrapper,
  Title,
} from "../../common/login/auth.styled";
import GithubButton from "../../common/login/GithubBtn";
import GoogleButton from "../../common/login/GoogleBtn";
import LoadingScreen from "../../common/loading/LoadingScreen";
import GoSignUp from "./GoSignUp";
import LoginForm from "./LoginForm";

const SparklesCore = lazy(() => import("../../common/ui/Sparkles"));

const CreateAccount = () => {
  return (
    <Container>
      <FullPageWrapper>
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
      </FullPageWrapper>
      <ContentWrapper>
        <Title>Log In</Title>
        <LoginForm />
        <GoSignUp />
        <GithubButton />
        <GoogleButton />
      </ContentWrapper>
    </Container>
  );
};

export default CreateAccount;
