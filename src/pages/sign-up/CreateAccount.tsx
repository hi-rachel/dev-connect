import { Suspense, lazy } from "react";
import {
  Container,
  ContentWrapper,
  FullPageWrapper,
} from "../../common/login/auth.styled";
import SignUpForm from "./SignUpForm";
import GoLogin from "./GoLogin";
import GithubButton from "../../common/login/GithubBtn";
import GoogleButton from "../../common/login/GoogleBtn";
import { Title } from "../../common/login/auth.styled";
import LoadingScreen from "../../common/loading/LoadingScreen";

const SparklesCore = lazy(() => import("../../common/ui/Sparkles"));

export default function CreateAccount() {
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
        <Title>Sign Up</Title>
        <SignUpForm />
        <GoLogin />
        <GithubButton />
        <GoogleButton />
      </ContentWrapper>
    </Container>
  );
}
