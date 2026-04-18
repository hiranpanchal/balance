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
  reason?: string;
  studioPhone: string;
  studioEmail: string;
}

export function BookingCancellation({
  ref,
  firstName,
  serviceName,
  date,
  time,
  reason,
  studioPhone,
  studioEmail,
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
            Hi {firstName},
          </Text>
          <Text style={text}>
            Your {serviceName} session on {formattedDate} at {time} (ref:{" "}
            {ref}) has been cancelled.
          </Text>
          {reason && (
            <Text style={text}>
              <strong>Reason:</strong> {reason}
            </Text>
          )}
          <Text style={text}>
            To rebook, please call {studioPhone} or email{" "}
            <a href={`mailto:${studioEmail}`} style={{ color: "#B28B5D" }}>
              {studioEmail}
            </a>
            . We&rsquo;d love to find you another time that works.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>Balance &amp; Wellness &mdash; Bristol</Text>
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
const hr = { borderColor: "#B28B5D", margin: "24px 0" };
const footer = { color: "#A09687", fontSize: "12px" };
