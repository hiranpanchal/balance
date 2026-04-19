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

interface WaitlistNotificationProps {
  firstName: string;
  date: string;
  bookUrl: string;
}

export function WaitlistNotification({ firstName, date, bookUrl }: WaitlistNotificationProps) {
  const formattedDate = new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Html>
      <Head />
      <Preview>A slot has opened up on {formattedDate} — book now</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Balance &amp; Wellness</Heading>
          <Text style={intro}>
            Hi {firstName}, good news — a slot has opened up on {formattedDate}.
          </Text>
          <Text style={text}>
            You were on the waiting list for this date. Slots go quickly, so book now to secure your place.
          </Text>
          <Button href={`${bookUrl}?date=${date}`} style={button}>
            Book now
          </Button>
          <Hr style={hr} />
          <Text style={footer}>
            Balance &amp; Wellness — you&rsquo;re receiving this because you joined our waiting list.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default WaitlistNotification;

const main = { backgroundColor: "#EAE2D2", fontFamily: "Georgia, serif" };
const container = {
  margin: "40px auto",
  maxWidth: "560px",
  backgroundColor: "#ffffff",
  padding: "40px",
  borderRadius: "4px",
};
const heading = { color: "#3E4F56", fontSize: "22px", fontWeight: "400", marginBottom: "20px" };
const intro = { color: "#3E4F56", fontSize: "16px", lineHeight: "26px", marginBottom: "16px" };
const text = { color: "#3E4F56", fontSize: "14px", lineHeight: "22px", marginBottom: "24px" };
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
