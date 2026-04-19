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

interface BookingCancellationProps {
  ref: string;
  firstName: string;
  serviceName: string;
  date: string;
  time: string;
  lateCancel?: boolean;
  studioPhone: string;
}

export function BookingCancellation({
  ref,
  firstName,
  serviceName,
  date,
  time,
  lateCancel,
  studioPhone,
}: BookingCancellationProps) {
  const formattedDate = new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Html>
      <Head />
      <Preview>Your Balance &amp; Wellness session ({ref}) has been cancelled</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Balance &amp; Wellness</Heading>
          <Text style={text}>
            Hi {firstName}, your {serviceName} session on {formattedDate} at {time} (ref: {ref}) has been cancelled.
          </Text>
          {lateCancel ? (
            <Text style={warning}>
              This cancellation was made within 24 hours of your appointment. A 50% late cancellation charge may apply. If you have any questions, please call {studioPhone}.
            </Text>
          ) : (
            <Text style={text}>
              No charge applies. We hope to see you again soon &mdash; rebook any time at your convenience.
            </Text>
          )}
          <Text style={text}>
            To rebook, call or message us on {studioPhone}.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>Balance &amp; Wellness &mdash; {studioPhone}</Text>
        </Container>
      </Body>
    </Html>
  );
}

export default BookingCancellation;

const main = { backgroundColor: "#EAE2D2", fontFamily: "Georgia, serif" };
const container = {
  margin: "40px auto",
  maxWidth: "520px",
  backgroundColor: "#ffffff",
  padding: "40px",
  borderRadius: "4px",
};
const heading = { color: "#3E4F56", fontSize: "22px", fontWeight: "400", marginBottom: "20px" };
const text = { color: "#3E4F56", fontSize: "15px", lineHeight: "26px", marginBottom: "16px" };
const warning = {
  color: "#3E4F56",
  fontSize: "15px",
  lineHeight: "26px",
  backgroundColor: "#fff8ee",
  borderLeft: "3px solid #B28B5D",
  padding: "14px 18px",
  marginBottom: "16px",
};
const hr = { borderColor: "#B28B5D", margin: "24px 0" };
const footer = { color: "#A09687", fontSize: "12px" };
