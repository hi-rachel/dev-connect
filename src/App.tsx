import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./layout";
import Home from "./Home";
import Profile from "./profile/Profile";
import Login from "./login/Login";
import CreateAccount from "./login/CreateAccount";
import { useEffect, useState } from "react";
import LoadingScreen from "./common/LoadingScreen";
import { auth } from "./firebase";
import ProtectedRoute from "./routes/ProtectedRoute";
import styled from "styled-components";
import LikedPosts from "./likes/LikedPosts";
import BookmarkedPosts from "./bookmarks/BookmarkedPosts";

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
      {
        path: "likes",
        element: <LikedPosts />,
      },
      {
        path: "bookmarks",
        element: <BookmarkedPosts />,
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
