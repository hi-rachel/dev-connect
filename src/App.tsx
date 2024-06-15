import { useEffect, useState, Suspense, lazy } from "react";
import { auth } from "./firebase";
import styled from "styled-components";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./layout";
import LoadingScreen from "./common/loading/LoadingScreen";
import ProtectedRoute from "./routes/ProtectedRoute";

const Home = lazy(() => import("./pages/home/Home"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const Login = lazy(() => import("./pages/login/Login"));
const CreateAccount = lazy(() => import("./pages/sign-up/CreateAccount"));
const BookmarkedPosts = lazy(() => import("./pages/bookmarks/BookmarkedPosts"));
const LikedPosts = lazy(() => import("./pages/likes/LikedPosts"));

const Wrapper = styled.div`
  overflow-x: hidden;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 0px;
  }
`;

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
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <Profile />
          </Suspense>
        ),
      },
      {
        path: "likes",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <LikedPosts />
          </Suspense>
        ),
      },
      {
        path: "bookmarks",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <BookmarkedPosts />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "create-account",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <CreateAccount />
      </Suspense>
    ),
  },
]);

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
      {loading ? (
        <LoadingScreen />
      ) : (
        <Suspense fallback={<LoadingScreen />}>
          <RouterProvider router={router} />
        </Suspense>
      )}
    </Wrapper>
  );
}

export default App;
