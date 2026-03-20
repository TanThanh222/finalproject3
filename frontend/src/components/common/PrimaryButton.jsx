import styled, { css } from "styled-components";

const baseStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  font-weight: 700;
  border-radius: 999px;
  cursor: pointer;
  border: none;
  outline: none;
  white-space: nowrap;

  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const sizeStyles = {
  sm: css`
    font-size: 0.8rem;
    padding: 7px 14px;
    min-height: 34px;
  `,
  md: css`
    font-size: 0.92rem;
    padding: 10px 18px;
    min-height: 42px;
  `,
  lg: css`
    font-size: 0.98rem;
    padding: 12px 24px;
    min-height: 48px;
  `,
};

const variantSolid = css`
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: #ffffff;
  box-shadow: 0 12px 24px rgba(79, 70, 229, 0.22);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 16px 28px rgba(79, 70, 229, 0.28);
    filter: brightness(1.02);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 10px 20px rgba(79, 70, 229, 0.2);
  }
`;

const variantOutline = css`
  background-color: #ffffff;
  color: #0f172a;
  border: 1px solid #dbe4f0;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);

  &:hover:not(:disabled) {
    color: #2563eb;
    border-color: #bfdbfe;
    background-color: #f8fbff;
    transform: translateY(-1px);
    box-shadow: 0 10px 22px rgba(37, 99, 235, 0.08);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const variantGhost = css`
  background-color: transparent;
  color: #334155;
  border: 1px solid transparent;

  &:hover:not(:disabled) {
    background-color: #f8fafc;
    color: #2563eb;
  }
`;

const variantIcon = css`
  padding: 0;
  width: 42px;
  height: 42px;
  min-height: 42px;
  border-radius: 999px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  color: #475569;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover:not(:disabled) {
    color: #2563eb;
    border-color: #bfdbfe;
    background: #f8fbff;
    box-shadow: 0 10px 22px rgba(37, 99, 235, 0.08);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const StyledButton = styled.button`
  ${baseStyles};
  ${({ size }) => sizeStyles[size || "md"]};

  ${({ variant }) => {
    if (variant === "outline") return variantOutline;
    if (variant === "ghost") return variantGhost;
    if (variant === "icon") return variantIcon;
    return variantSolid;
  }};
`;

export default function PrimaryButton({
  children,
  variant = "solid",
  size = "md",
  as = "button",
  type = "button",
  ...rest
}) {
  return (
    <StyledButton as={as} variant={variant} size={size} type={type} {...rest}>
      {children}
    </StyledButton>
  );
}
