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
import { UserAvatar } from "./common/user/Avatar";

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
                width={50}
                src="main-logo.png"
                alt="Dev Connect Logo"
                aria-label="Dev Connect Logo"
              />
            </MenuItem>
          </Link>
          <div>
            <UserAvatar
              src={user.photoURL || ""}
              onClick={togglePopover}
              style={{ cursor: "pointer" }}
            />
            {showPopover && (
              <AvatarPopUp onClick={onLogOut}>
                <CgLogOut size={28} />
                <p>Log Out @{user.displayName}</p>
              </AvatarPopUp>
            )}
          </div>
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
            {user && <UserAvatar src={user.photoURL || ""} />}
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
