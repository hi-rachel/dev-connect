import { useEffect, useState, Suspense } from "react";
import { auth } from "./firebase";
import styled from "styled-components";
import { RouterProvider } from "react-router-dom";
import LoadingScreen from "./common/loading/LoadingScreen";
import ThemeLayout from "./common/ThemeLayout";
import router from "./routes/router";

const Wrapper = styled.div`
  overflow-x: hidden;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 0px;
  }
`;

const App = () => {
  const [loading, setLoading] = useState(true);

  const init = async () => {
    await auth.authStateReady();
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Wrapper>
      <ThemeLayout />
      {loading ? (
        <LoadingScreen />
      ) : (
        <Suspense fallback={<LoadingScreen />}>
          <RouterProvider router={router} />
        </Suspense>
      )}
    </Wrapper>
  );
};

export default App;
