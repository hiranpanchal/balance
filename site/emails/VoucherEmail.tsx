import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface VoucherEmailProps {
  purchaserName: string;
  recipientName?: string;
  code: string;
  amountGbp: number;
  expiresAt: string;
  message?: string;
  isGift?: boolean;
}

export function VoucherEmail({
  purchaserName,
  recipientName,
  code,
  amountGbp,
  expiresAt,
  message,
  isGift,
}: VoucherEmailProps) {
  const recipient = isGift && recipientName ? recipientName : purchaserName;
  const formattedExpiry = new Date(expiresAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Html>
      <Head />
      <Preview>{`Your Balance & Wellness gift voucher — £${amountGbp}`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Balance &amp; Wellness</Heading>

          {isGift ? (
            <Text style={intro}>
              Hi {recipient}, {purchaserName} has sent you a gift voucher for a Balance &amp; Wellness session.
            </Text>
          ) : (
            <Text style={intro}>
              Hi {purchaserName}, your gift voucher is ready.
            </Text>
          )}

          {isGift && message && (
            <Text style={messageStyle}>
              &ldquo;{message}&rdquo;
            </Text>
          )}

          <div style={voucherBox}>
            <Text style={voucherLabel}>Your voucher code</Text>
            <Text style={voucherCode}>{code}</Text>
            <Text style={voucherAmount}>£{amountGbp}</Text>
            <Text style={voucherExpiry}>Valid until {formattedExpiry}</Text>
          </div>

          <Text style={text}>
            To redeem, simply enter this code when booking online. Your voucher covers any treatment and can be applied at checkout.
          </Text>

          <Hr style={hr} />
          <Text style={footer}>
            Balance &amp; Wellness — gift vouchers are valid for 12 months and are non-refundable.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default VoucherEmail;

const main = { backgroundColor: "#EAE2D2", fontFamily: "Georgia, serif" };
const container = {
  margin: "40px auto",
  maxWidth: "560px",
  backgroundColor: "#ffffff",
  padding: "40px",
  borderRadius: "4px",
};
const heading = { color: "#3E4F56", fontSize: "22px", fontWeight: "400", marginBottom: "20px" };
const intro = { color: "#3E4F56", fontSize: "16px", lineHeight: "26px", marginBottom: "24px" };
const messageStyle = {
  color: "#3E4F56",
  fontSize: "15px",
  lineHeight: "26px",
  fontStyle: "italic",
  borderLeft: "3px solid #B28B5D",
  paddingLeft: "16px",
  marginBottom: "24px",
};
const voucherBox = {
  backgroundColor: "#3E4F56",
  borderRadius: "4px",
  padding: "32px",
  textAlign: "center" as const,
  marginBottom: "24px",
};
const voucherLabel = { color: "#A09687", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase" as const, margin: "0 0 12px 0" };
const voucherCode = { color: "#EAE2D2", fontSize: "28px", fontFamily: "monospace", letterSpacing: "0.15em", margin: "0 0 8px 0", fontWeight: "600" };
const voucherAmount = { color: "#B28B5D", fontSize: "36px", fontFamily: "Georgia, serif", margin: "0 0 8px 0" };
const voucherExpiry = { color: "#A09687", fontSize: "12px", margin: 0 };
const text = { color: "#3E4F56", fontSize: "14px", lineHeight: "22px", marginBottom: "16px" };
const hr = { borderColor: "#B28B5D", margin: "24px 0" };
const footer = { color: "#A09687", fontSize: "12px" };
