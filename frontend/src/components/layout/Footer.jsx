import styled from "styled-components";
import PageContainer from "./PageContainer";
import Logo from "../../assets/logos/edupress.svg";
import {
  FacebookIcon,
  PIcon,
  XIcon,
  InstaIcon,
  YoutubeIcon,
} from "../../assets/icons/social";

const FooterWrapper = styled.footer`
  background-color: #f5f5f5; /* White_grey trong Figma */
  padding-top: 90px;
  padding-bottom: 32px;
`;

const TopSection = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2.2fr) repeat(3, minmax(0, 1fr));
  gap: 30px;
  align-items: flex-start;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const BrandBlock = styled.div`
  max-width: 320px;
`;

const BrandRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 16px;

  img {
    height: 32px;
    width: auto;
    display: block;
  }

  span {
    font-weight: 700;
    font-size: 28px;
    color: #111827;
  }
`;

const BrandText = styled.p`
  font-size: 18px;
  font-weight: 400;
  color: #6b7280;
`;

const Column = styled.div``;

const ColumnTitle = styled.h4`
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #111827;
  margin-bottom: 14px;
`;

const LinkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const LinkItem = styled.li`
  font-size: 18px;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 8px;
  cursor: pointer;
  transition: color 0.15s ease;

  &:hover {
    color: #ff782d;
  }
`;

const ContactText = styled.p`
  font-size: 18px;
  font-weight: 400;
  color: #6b7280;
`;

const SocialRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
`;

const SocialDot = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg path {
    fill: #5f5f5f;
    transition: all 0.25s ease;
  }

  &:hover svg path {
    fill: #ff782d;
  }
`;

const BottomBar = styled.div`
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
  font-size: 0.75rem;
  color: #9ca3af;
  text-align: center;
`;

export default function Footer() {
  return (
    <FooterWrapper>
      <PageContainer>
        <TopSection>
          <BrandBlock>
            <BrandRow>
              <img src={Logo} alt="EduPress" />
              <span>EduPress</span>
            </BrandRow>
            <BrandText>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </BrandText>
          </BrandBlock>
          <Column>
            <ColumnTitle>Get Help</ColumnTitle>
            <LinkList>
              <LinkItem>Contact Us</LinkItem>
              <LinkItem>Latest Articles</LinkItem>
              <LinkItem>FAQ</LinkItem>
            </LinkList>
          </Column>
          <Column>
            <ColumnTitle>Programs</ColumnTitle>
            <LinkList>
              <LinkItem>Art &amp; Design</LinkItem>
              <LinkItem>Business</LinkItem>
              <LinkItem>IT &amp; Software</LinkItem>
              <LinkItem>Languages</LinkItem>
              <LinkItem>Programming</LinkItem>
            </LinkList>
          </Column>
          <Column>
            <ColumnTitle>Contact Us</ColumnTitle>
            <ContactText>
              Address: 2321 New Design Str, Lorem Ipsum 10 Hudson Yards, USA
            </ContactText>
            <ContactText>Tel: + (123) 2500-567-8988</ContactText>
            <ContactText>Mail: supportlms@gmail.com</ContactText>

            <SocialRow>
              <SocialDot href="#">
                <FacebookIcon />
              </SocialDot>

              <SocialDot href="#">
                <PIcon />
              </SocialDot>

              <SocialDot href="#">
                <XIcon />
              </SocialDot>

              <SocialDot href="#">
                <InstaIcon />
              </SocialDot>

              <SocialDot href="#">
                <YoutubeIcon />
              </SocialDot>
            </SocialRow>
          </Column>
        </TopSection>
        <BottomBar>
          Copyright © 2024 LearnPress LMS | Powered by ThimPress
        </BottomBar>
      </PageContainer>
    </FooterWrapper>
  );
}
