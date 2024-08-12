import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { auth } from "./firebase";
import {
  AvatarPopUp,
  FooterMenu,
  FooterMenuItem,
  LayoutHeader,
  LayoutHeaderRightDiv,
  LayoutWrapper,
  Menu,
  MenuItem,
  ToogleTheme,
} from "./layout.styled";
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { HiHome, HiOutlineHome } from "react-icons/hi";
import { FaRegUser, FaUser } from "react-icons/fa6";
import { CgLogOut } from "react-icons/cg";
import {
  AvartarImg,
  LayoutAvatarCircle,
  PostAvatarCircle,
} from "./common/user/Avatar";
import { BsEmojiSunglasses } from "react-icons/bs";
import { RiMoonClearLine } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";

const Layout = () => {
  const { t } = useTranslation();
  const user = auth.currentUser;
  const [theme, setTheme] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState("");
  const [showPopover, setShowPopover] = useState(false);

  const applyTheme = (theme: string) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    setTheme(theme);
  };

  const handleToggleTheme = () => {
    const currentTheme =
      localStorage.getItem("theme") === "dark" ? "light" : "dark";
    applyTheme(currentTheme);
  };

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    applyTheme(savedTheme);
  }, [theme]);

  const handleLogOut = async () => {
    const ok = confirm("Are you sure you want to log out?");
    if (ok) {
      auth.signOut();
      navigate("/login");
    }
  };

  const handleChangeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
  };

  const setInitialLanguage = () => {
    const savedLanguage = localStorage.getItem("i18nextLng");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    } else {
      const userLang = navigator.language;
      const isKorean = userLang.startsWith("ko");
      i18n.changeLanguage(isKorean ? "ko" : "en");
    }
  };

  useEffect(() => {
    setInitialLanguage();
  }, []);

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

  const handleTogglePopover = () => {
    setShowPopover((prev) => !prev);
  };

  const LanguageToggleButton = () =>
    i18n.language === "en" ? (
      <MenuItem>
        <button onClick={() => handleChangeLanguage("ko")}>Ko</button>
      </MenuItem>
    ) : (
      <MenuItem>
        <button onClick={() => handleChangeLanguage("en")}>En</button>
      </MenuItem>
    );

  if (!user) return null;

  return (
    <>
      <LayoutWrapper>
        <LayoutHeader>
          <Link to="/">
            <MenuItem onClick={() => setSelectedItem("home")}>
              <img
                width={40}
                src="main-logo.png"
                alt={"Dev Connect Logo"}
                aria-label={"Dev Connect Logo"}
              />
            </MenuItem>
          </Link>
          <LayoutHeaderRightDiv>
            <LanguageToggleButton />
            <ToogleTheme onClick={handleToggleTheme}>
              {theme === "dark" ? (
                <BsEmojiSunglasses id="lightModeIcon" size={35} />
              ) : (
                <RiMoonClearLine id="darkModeIcon" size={35} />
              )}
            </ToogleTheme>
            <MenuItem>
              <PostAvatarCircle>
                {user.photoURL ? (
                  <AvartarImg
                    src={user.photoURL}
                    onClick={handleTogglePopover}
                  />
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
          </LayoutHeaderRightDiv>
          {showPopover && (
            <AvatarPopUp onClick={handleLogOut}>
              <CgLogOut size={25} />
              <p>
                {t("nav.log_out")} @{user.displayName}
              </p>
            </AvatarPopUp>
          )}
        </LayoutHeader>

        <Menu>
          <Link to="/">
            <MenuItem onClick={() => setSelectedItem("home")}>
              <img
                width={50}
                src="main-logo.png"
                alt={t("nav.home")}
                aria-label={t("nav.home")}
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
          <MenuItem onClick={handleLogOut}>
            <CgLogOut size={26} />
          </MenuItem>
          <ToogleTheme onClick={handleToggleTheme}>
            {theme === "dark" ? (
              <BsEmojiSunglasses id="lightModeIcon" size={26} />
            ) : (
              <RiMoonClearLine id="darkModeIcon" size={26} />
            )}
          </ToogleTheme>
          <MenuItem>
            <LayoutAvatarCircle>
              {user.photoURL ? (
                <AvartarImg src={user.photoURL} onClick={handleTogglePopover} />
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
          {i18n.language === "ko" && (
            <MenuItem>
              <button onClick={() => handleChangeLanguage("en")}>En</button>
            </MenuItem>
          )}
          {i18n.language === "en" && (
            <MenuItem>
              <button onClick={() => handleChangeLanguage("ko")}>Ko</button>
            </MenuItem>
          )}
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
                <FaHeart aria-label={t("nav.likes")} size={26} />
              ) : (
                <FaRegHeart size={26} />
              )}
            </FooterMenuItem>
          </Link>
          <Link to="/bookmarks">
            <FooterMenuItem onClick={() => setSelectedItem("bookmarks")}>
              {selectedItem === "bookmarks" ? (
                <FaBookmark aria-label={t("nav.bookmarks")} size={26} />
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
};

export default Layout;
