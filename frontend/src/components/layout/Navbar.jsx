import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useMemo, useState } from "react";
import PageContainer from "./PageContainer";
import Logo from "../../assets/logos/edupress.svg";
import { SearchIcon } from "../../assets/icons/ui";
import PrimaryButton from "../common/PrimaryButton.jsx";
import useAuth from "../../hook/useAuth";

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.05);
`;

const NavBar = styled.nav`
  min-height: 78px;
  display: flex;
  align-items: center;
  gap: 18px;
`;

const Brand = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;

  img {
    height: 34px;
    width: auto;
    display: block;
  }

  span {
    font-weight: 800;
    font-size: 30px;
    line-height: 1;
    color: #0f172a;
    letter-spacing: -0.03em;
  }
`;

const NavCenter = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;

  @media (max-width: 980px) {
    display: none;
  }
`;

const NavList = styled.ul`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NavItem = styled.li`
  display: flex;
`;

const NavItemLink = styled(NavLink)`
  position: relative;
  height: 44px;
  padding: 0 18px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  color: #475569;
  transition: all 0.22s ease;

  &:hover {
    color: #2563eb;
    background: #f8fafc;
  }

  &.active {
    color: #ffffff;
    background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
    box-shadow: 0 12px 24px rgba(79, 70, 229, 0.22);
  }
`;

const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 980px) {
    display: none;
  }
`;

const SearchButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #475569;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05);
  transition: all 0.2s ease;

  &:hover {
    color: #2563eb;
    border-color: #cbd5e1;
    transform: translateY(-1px);
    box-shadow: 0 10px 22px rgba(37, 99, 235, 0.08);
  }
`;

const MobileToggle = styled.button`
  margin-left: auto;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #334155;
  display: none;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05);

  @media (max-width: 980px) {
    display: inline-flex;
  }
`;

const MobilePanel = styled.div`
  display: none;
  padding: 0 0 18px;

  @media (max-width: 980px) {
    display: ${({ $open }) => ($open ? "block" : "none")};
  }
`;

const MobileCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 22px;
  padding: 14px;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
`;

const MobileNavList = styled.div`
  display: grid;
  gap: 10px;
`;

const MobileLink = styled(NavLink)`
  min-height: 48px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #334155;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
  }

  &.active {
    color: #2563eb;
    background: #f8fbff;
    border-color: #bfdbfe;
  }
`;

const MobileActions = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 14px;
`;

const AdminButton = styled(PrimaryButton)`
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%) !important;
  color: #ffffff !important;
  border: none !important;
  box-shadow: 0 12px 24px rgba(79, 70, 229, 0.2);
`;

const DesktopGhostButton = styled(PrimaryButton)`
  border-radius: 14px !important;
`;

function BurgerIcon() {
  return (
    <span
      style={{
        width: 18,
        height: 14,
        display: "inline-flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <span style={{ height: 2, background: "#334155", borderRadius: 999 }} />
      <span style={{ height: 2, background: "#334155", borderRadius: 999 }} />
      <span style={{ height: 2, background: "#334155", borderRadius: 999 }} />
    </span>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  const menuItems = useMemo(
    () => [
      { to: "/", label: "Home", end: true },
      { to: "/courses", label: "Courses" },
      { to: "/my-courses", label: "My Courses" },
    ],
    [],
  );

  const closeMobile = () => setMobileOpen(false);

  const goTo = (path) => {
    navigate(path);
    closeMobile();
  };

  const handleLogout = () => {
    logout?.();
    navigate("/", { replace: true });
    closeMobile();
  };

  return (
    <Header>
      <PageContainer>
        <NavBar>
          <Brand type="button" onClick={() => goTo("/")}>
            <img src={Logo} alt="EduPress" />
            <span>EduPress</span>
          </Brand>

          <NavCenter>
            <NavList>
              {menuItems.map((item) => (
                <NavItem key={item.to}>
                  <NavItemLink to={item.to} end={item.end}>
                    {item.label}
                  </NavItemLink>
                </NavItem>
              ))}
            </NavList>
          </NavCenter>

          <RightActions>
            {isAdmin && (
              <AdminButton size="md" onClick={() => navigate("/admin/courses")}>
                Admin
              </AdminButton>
            )}

            {user ? (
              <DesktopGhostButton
                variant="outline"
                size="md"
                onClick={handleLogout}
              >
                Logout
              </DesktopGhostButton>
            ) : (
              <DesktopGhostButton
                variant="outline"
                size="md"
                onClick={() => navigate("/auth")}
              >
                Login / Register
              </DesktopGhostButton>
            )}

            <SearchButton
              type="button"
              aria-label="Search"
              onClick={() => navigate("/courses")}
            >
              <SearchIcon />
            </SearchButton>
          </RightActions>

          <MobileToggle
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <BurgerIcon />
          </MobileToggle>
        </NavBar>

        <MobilePanel $open={mobileOpen}>
          <MobileCard>
            <MobileNavList>
              {menuItems.map((item) => (
                <MobileLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={closeMobile}
                >
                  {item.label}
                </MobileLink>
              ))}
            </MobileNavList>

            <MobileActions>
              {isAdmin && (
                <AdminButton size="md" onClick={() => goTo("/admin/courses")}>
                  Admin
                </AdminButton>
              )}

              {user ? (
                <DesktopGhostButton
                  variant="outline"
                  size="md"
                  onClick={handleLogout}
                >
                  Logout
                </DesktopGhostButton>
              ) : (
                <DesktopGhostButton
                  variant="outline"
                  size="md"
                  onClick={() => goTo("/auth")}
                >
                  Login / Register
                </DesktopGhostButton>
              )}

              <DesktopGhostButton
                variant="outline"
                size="md"
                onClick={() => goTo("/courses")}
              >
                Search Courses
              </DesktopGhostButton>
            </MobileActions>
          </MobileCard>
        </MobilePanel>
      </PageContainer>
    </Header>
  );
}
