import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./layout";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Login from "./pages/login/Login";
import CreateAccount from "./pages/login/CreateAccount";
import { useEffect, useState } from "react";
import LoadingScreen from "./common/loading/LoadingScreen";
import { auth } from "./firebase";
import ProtectedRoute from "./routes/ProtectedRoute";
import styled from "styled-components";
import LikedPosts from "./pages/likes/LikedPosts";
import BookmarkedPosts from "./pages/bookmarks/BookmarkedPosts";

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
  overflow-x: hidden;
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
