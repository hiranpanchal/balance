import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface BookingConfirmationProps {
  ref: string;
  firstName: string;
  serviceName: string;
  duration: number;
  date: string;
  time: string;
  price: number;
  isFirstTime: boolean;
  studioAddress: string;
  studioPhone: string;
  cancelUrl?: string;
  confirmedBookingCount?: number;
  isRegular?: boolean;
}

export function BookingConfirmation({
  ref,
  firstName,
  serviceName,
  duration,
  date,
  time,
  price,
  isFirstTime,
  studioAddress,
  studioPhone,
  cancelUrl,
  confirmedBookingCount,
  isRegular,
}: BookingConfirmationProps) {
  const formattedDate = new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Html>
      <Head />
      <Preview>Your Balance &amp; Wellness session is confirmed — {formattedDate} at {time}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Balance &amp; Wellness</Heading>
          <Text style={intro}>
            Hi {firstName}, your session is confirmed. We&rsquo;re looking forward to seeing you.
          </Text>

          <Section style={detailBox}>
            <Row style={{ marginBottom: "10px" }}>
              <Column style={label}>Treatment</Column>
              <Column style={value}>{serviceName}</Column>
            </Row>
            <Row style={{ marginBottom: "10px" }}>
              <Column style={label}>Duration</Column>
              <Column style={value}>{duration} minutes</Column>
            </Row>
            <Row style={{ marginBottom: "10px" }}>
              <Column style={label}>Date</Column>
              <Column style={value}>{formattedDate}</Column>
            </Row>
            <Row style={{ marginBottom: "10px" }}>
              <Column style={label}>Time</Column>
              <Column style={value}>{time}</Column>
            </Row>
            <Row style={{ marginBottom: "10px" }}>
              <Column style={label}>Price</Column>
              <Column style={value}>£{price}</Column>
            </Row>
            <Row>
              <Column style={label}>Ref</Column>
              <Column style={value}>{ref}</Column>
            </Row>
          </Section>

          {isFirstTime && (
            <Section style={callout}>
              <Text style={calloutText}>
                <strong>First visit?</strong> Please arrive ten minutes early — it gives us time to welcome you properly before the session starts.
              </Text>
            </Section>
          )}

          <Hr style={hr} />

          <Text style={text}>
            <strong>Where to find us</strong>
            <br />
            {studioAddress.replace(/\n/g, ", ")}
          </Text>

          {!isRegular && confirmedBookingCount !== undefined && confirmedBookingCount < 5 && (
            <Section style={loyaltyBox}>
              <Text style={loyaltyText}>
                <strong>Your progress to Regular status</strong>
                <br />
                {confirmedBookingCount} of 5 sessions complete — {5 - confirmedBookingCount} more to go. Regular customers pay a 50% deposit instead of full price.
              </Text>
              <Text style={loyaltyBar}>
                {"▓".repeat(confirmedBookingCount)}{"░".repeat(5 - confirmedBookingCount)} {confirmedBookingCount}/5
              </Text>
            </Section>
          )}

          {isRegular && (
            <Section style={loyaltyBox}>
              <Text style={loyaltyText}>
                <strong>Regular customer</strong> — your 50% deposit benefit is active on all future bookings. Thank you for being a loyal guest.
              </Text>
            </Section>
          )}

          <Text style={text}>
            <strong>Need to change anything?</strong>
            <br />
            Call or message us at least 24 hours before: {studioPhone}. Changes inside 24 hours are charged at 50%.
          </Text>

          {cancelUrl && (
            <Text style={text}>
              <a href={cancelUrl} style={{ color: "#A09687" }}>Cancel this booking</a>
            </Text>
          )}

          <Hr style={hr} />
          <Text style={footer}>
            Balance &amp; Wellness
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default BookingConfirmation;

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
const detailBox = {
  backgroundColor: "#F5F0E6",
  padding: "24px",
  borderRadius: "4px",
  marginBottom: "24px",
};
const label = { color: "#A09687", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase" as const, width: "120px" };
const value = { color: "#3E4F56", fontSize: "14px" };
const callout = {
  backgroundColor: "#fff8ee",
  borderLeft: "3px solid #B28B5D",
  padding: "14px 18px",
  marginBottom: "24px",
};
const calloutText = { color: "#3E4F56", fontSize: "14px", lineHeight: "22px", margin: 0 };
const hr = { borderColor: "#B28B5D", margin: "24px 0" };
const text = { color: "#3E4F56", fontSize: "14px", lineHeight: "22px", marginBottom: "16px" };
const footer = { color: "#A09687", fontSize: "12px" };
const loyaltyBox = { backgroundColor: "#F5F0E6", padding: "16px 20px", borderRadius: "4px", marginBottom: "24px" };
const loyaltyText = { color: "#3E4F56", fontSize: "13px", lineHeight: "22px", margin: "0 0 8px 0" };
const loyaltyBar = { color: "#B28B5D", fontSize: "14px", fontFamily: "monospace", margin: 0 };
