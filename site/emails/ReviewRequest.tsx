import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ReviewRequestProps {
  firstName: string;
  serviceName: string;
  reviewUrl?: string;
}

export function ReviewRequest({ firstName, serviceName, reviewUrl }: ReviewRequestProps) {
  return (
    <Html>
      <Head />
      <Preview>How was your {serviceName} session?</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Balance &amp; Wellness</Heading>
          <Text style={intro}>
            Hi {firstName}, we hope you&rsquo;re still feeling the benefit of your {serviceName} session.
          </Text>

          <Text style={text}>
            If you have a spare moment, we&rsquo;d love to hear how it went. A short review means a great deal to a small, independent studio — and helps other guests find us.
          </Text>

          {reviewUrl && (
            <Button href={reviewUrl} style={button}>
              Leave a review
            </Button>
          )}

          <Hr style={hr} />

          <Text style={text}>
            We look forward to welcoming you back.
          </Text>

          <Text style={footer}>Balance &amp; Wellness</Text>
        </Container>
      </Body>
    </Html>
  );
}

export default ReviewRequest;

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
const text = { color: "#3E4F56", fontSize: "14px", lineHeight: "22px", marginBottom: "16px" };
const button = {
  backgroundColor: "#3E4F56",
  color: "#EAE2D2",
  padding: "14px 28px",
  borderRadius: "4px",
  fontSize: "12px",
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  display: "inline-block",
  marginBottom: "24px",
};
const hr = { borderColor: "#B28B5D", margin: "24px 0" };
const footer = { color: "#A09687", fontSize: "12px" };
