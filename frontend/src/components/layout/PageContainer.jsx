import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;

  @media (min-width: 640px) {
    padding-left: 24px;
    padding-right: 24px;
  }

  @media (min-width: 1280px) {
    padding-left: 32px;
    padding-right: 32px;
  }
`;

export default function PageContainer({ children, className }) {
  return <Wrapper className={className}>{children}</Wrapper>;
}
