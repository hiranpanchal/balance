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

interface RebookingNudgeProps {
  firstName: string;
  lastServiceName: string;
  bookUrl: string;
}

export function RebookingNudge({ firstName, lastServiceName, bookUrl }: RebookingNudgeProps) {
  return (
    <Html>
      <Head />
      <Preview>It&apos;s been a while, {firstName} — time for another session?</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Balance &amp; Wellness</Heading>
          <Text style={intro}>
            Hi {firstName}, it&rsquo;s been a little while since your last visit.
          </Text>

          <Text style={text}>
            We hope you&rsquo;ve been well. Your last session was a {lastServiceName} — if your body is asking for the same again, or something different, we&rsquo;d love to welcome you back.
          </Text>

          <Text style={text}>
            When you&rsquo;re ready, booking takes a couple of minutes.
          </Text>

          <Button href={bookUrl} style={button}>
            Book a session
          </Button>

          <Hr style={hr} />

          <Text style={footer}>
            Balance &amp; Wellness — you&rsquo;re receiving this because you&rsquo;ve visited us before.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default RebookingNudge;

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
