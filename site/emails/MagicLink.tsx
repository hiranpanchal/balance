import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface MagicLinkEmailProps {
  url: string;
}

export function MagicLinkEmail({ url }: MagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Sign in to Balance &amp; Wellness admin</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Balance &amp; Wellness</Heading>
          <Text style={text}>
            Click the button below to sign in to your admin panel. This link
            expires in 24 hours and can only be used once.
          </Text>
          <Section style={{ textAlign: "center", margin: "32px 0" }}>
            <Button href={url} style={button}>
              Sign in
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            If you didn&rsquo;t request this, you can safely ignore it.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default MagicLinkEmail;

const main = { backgroundColor: "#EAE2D2", fontFamily: "Georgia, serif" };
const container = {
  margin: "40px auto",
  maxWidth: "520px",
  backgroundColor: "#ffffff",
  padding: "40px",
  borderRadius: "4px",
};
const heading = { color: "#3E4F56", fontSize: "22px", fontWeight: "400", marginBottom: "24px" };
const text = { color: "#3E4F56", fontSize: "15px", lineHeight: "24px" };
const button = {
  backgroundColor: "#3E4F56",
  color: "#EAE2D2",
  fontSize: "13px",
  letterSpacing: "0.12em",
  padding: "14px 32px",
  borderRadius: "2px",
  textDecoration: "none",
};
const hr = { borderColor: "#B28B5D", margin: "32px 0" };
const footer = { color: "#A09687", fontSize: "12px", lineHeight: "20px" };
