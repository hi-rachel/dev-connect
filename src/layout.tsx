import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { auth } from "./firebase";
import { useEffect, useState } from "react";
import {
  AvatarPopUp,
  FooterMenu,
  FooterMenuItem,
  LayoutHeader,
  LayoutWrapper,
  Menu,
  MenuItem,
} from "./layout.styled";
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { HiHome, HiOutlineHome } from "react-icons/hi";
import { FaRegUser, FaUser } from "react-icons/fa6";
import { CgLogOut } from "react-icons/cg";
import {
  AvartarImg,
  LayoutAvatarCircle,
  PostAvatarCircle,
  UserAvatar,
} from "./common/user/Avatar";
import { BsEmojiSunglasses } from "react-icons/bs";

export default function Layout() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState("");
  const [showPopover, setShowPopover] = useState(false);

  const onLogOut = async () => {
    const ok = confirm("Are you sure you want to log out?");
    if (ok) {
      auth.signOut();
      navigate("/login");
    }
  };

  useEffect(() => {
    if (location.pathname === "/") {
      setSelectedItem("home");
    } else if (location.pathname === "/profile") {
      setSelectedItem("profile");
    } else if (location.pathname === "/likes") {
      setSelectedItem("likes");
    } else if (location.pathname === "bookmarks") {
      setSelectedItem("bookmarks");
    }
  }, [location]);

  const togglePopover = () => {
    setShowPopover((prev) => !prev);
  };

  if (!user) return;

  return (
    <>
      <LayoutWrapper>
        <LayoutHeader>
          <Link to="/">
            <MenuItem onClick={() => setSelectedItem("home")}>
              <img
                width={40}
                src="main-logo.png"
                alt="Dev Connect Logo"
                aria-label="Dev Connect Logo"
              />
            </MenuItem>
          </Link>
          <MenuItem>
            <PostAvatarCircle>
              {user.photoURL ? (
                <UserAvatar src={user.photoURL} onClick={togglePopover} />
              ) : (
                <svg
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                </svg>
              )}
            </PostAvatarCircle>
          </MenuItem>
          {showPopover && (
            <AvatarPopUp onClick={onLogOut}>
              <CgLogOut size={25} />
              <p>Log Out @{user.displayName}</p>
            </AvatarPopUp>
          )}
        </LayoutHeader>

        <Menu>
          <Link to="/">
            <MenuItem onClick={() => setSelectedItem("home")}>
              <img
                width={50}
                src="main-logo.png"
                alt="Dev Connect Logo"
                aria-label="Dev Connect Logo"
              />
            </MenuItem>
          </Link>
          <Link to="/">
            <MenuItem onClick={() => setSelectedItem("home")}>
              {selectedItem === "home" ? (
                <HiHome size={30} />
              ) : (
                <HiOutlineHome size={30} />
              )}
            </MenuItem>
          </Link>
          <Link to="/profile">
            <MenuItem onClick={() => setSelectedItem("profile")}>
              {selectedItem === "profile" ? (
                <FaUser size={26} />
              ) : (
                <FaRegUser size={26} />
              )}
            </MenuItem>
          </Link>
          <Link to="/likes">
            <MenuItem onClick={() => setSelectedItem("likes")}>
              {selectedItem === "likes" ? (
                <FaHeart aria-label="Liked Posts Page" size={26} />
              ) : (
                <FaRegHeart size={26} />
              )}
            </MenuItem>
          </Link>
          <Link to="/bookmarks">
            <MenuItem onClick={() => setSelectedItem("bookmarks")}>
              {selectedItem === "bookmarks" ? (
                <FaBookmark aria-label="Bookmarked Posts Page" size={26} />
              ) : (
                <FaRegBookmark size={26} />
              )}
            </MenuItem>
          </Link>
          <MenuItem onClick={onLogOut}>
            <CgLogOut size={26} />
          </MenuItem>
          <MenuItem>
            <LayoutAvatarCircle>
              {user.photoURL ? (
                <AvartarImg src={user.photoURL} onClick={togglePopover} />
              ) : (
                <svg
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                </svg>
              )}
            </LayoutAvatarCircle>
          </MenuItem>
          <MenuItem>
            <BsEmojiSunglasses />
          </MenuItem>
        </Menu>

        <FooterMenu>
          <Link to="/">
            <FooterMenuItem onClick={() => setSelectedItem("home")}>
              {selectedItem === "home" ? (
                <HiHome size={30} />
              ) : (
                <HiOutlineHome size={30} />
              )}
            </FooterMenuItem>
          </Link>
          <Link to="/profile">
            <FooterMenuItem onClick={() => setSelectedItem("profile")}>
              {selectedItem === "profile" ? (
                <FaUser size={26} />
              ) : (
                <FaRegUser size={26} />
              )}
            </FooterMenuItem>
          </Link>
          <Link to="/likes">
            <FooterMenuItem onClick={() => setSelectedItem("likes")}>
              {selectedItem === "likes" ? (
                <FaHeart aria-label="Liked Posts Page" size={26} />
              ) : (
                <FaRegHeart size={26} />
              )}
            </FooterMenuItem>
          </Link>
          <Link to="/bookmarks">
            <FooterMenuItem onClick={() => setSelectedItem("bookmarks")}>
              {selectedItem === "bookmarks" ? (
                <FaBookmark aria-label="Bookmarked Posts Page" size={26} />
              ) : (
                <FaRegBookmark size={26} />
              )}
            </FooterMenuItem>
          </Link>
        </FooterMenu>

        <Outlet />
      </LayoutWrapper>
    </>
  );
}
