import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import CreateAccount from "./routes/create-account";
import { useEffect, useState } from "react";
import LoadingScreen from "./components/loading-screen";
import { auth } from "./firebase";
import ProtectedRoute from "./components/protected-route";
import styled from "styled-components";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "create-account",
    element: <CreateAccount />,
  },
]);

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`;

function App() {
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
      {loading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  );
}

export default App;
