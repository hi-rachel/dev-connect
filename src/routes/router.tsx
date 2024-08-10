import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../layout";
import LoadingScreen from "../common/loading/LoadingScreen";
import NotFound from "../pages/not-found/NotFound";

const Home = lazy(() => import("../pages/home/Home"));
const Profile = lazy(() => import("../pages/profile/Profile"));
const Login = lazy(() => import("../pages/login/Login"));
const CreateAccount = lazy(() => import("../pages/sign-up/CreateAccount"));
const BookmarkedPosts = lazy(
  () => import("../pages/bookmarks/BookmarkedPosts")
);
const LikedPosts = lazy(() => import("../pages/likes/LikedPosts"));

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
    path: "login",
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
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <NotFound />
      </Suspense>
    ),
  },
]);

export default router;
