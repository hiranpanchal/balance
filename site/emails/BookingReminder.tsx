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

interface BookingReminderProps {
  firstName: string;
  serviceName: string;
  duration: number;
  date: string;
  time: string;
  studioAddress: string;
  studioPhone: string;
}

export function BookingReminder({
  firstName,
  serviceName,
  duration,
  date,
  time,
  studioAddress,
  studioPhone,
}: BookingReminderProps) {
  const formattedDate = new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Html>
      <Head />
      <Preview>Tomorrow: your {serviceName} session at {time}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Balance &amp; Wellness</Heading>
          <Text style={intro}>
            Hi {firstName}, just a friendly reminder that your session is tomorrow. We&rsquo;re looking forward to seeing you.
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
            <Row>
              <Column style={label}>Time</Column>
              <Column style={value}>{time}</Column>
            </Row>
          </Section>

          <Text style={text}>
            <strong>Where to find us</strong>
            <br />
            {studioAddress.replace(/\n/g, ", ")}
          </Text>

          <Text style={text}>
            <strong>Need to cancel or reschedule?</strong>
            <br />
            Please call or message us as soon as possible: {studioPhone}. Cancellations inside 24 hours are charged at 50%.
          </Text>

          <Hr style={hr} />
          <Text style={footer}>Balance &amp; Wellness</Text>
        </Container>
      </Body>
    </Html>
  );
}

export default BookingReminder;

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
const hr = { borderColor: "#B28B5D", margin: "24px 0" };
const text = { color: "#3E4F56", fontSize: "14px", lineHeight: "22px", marginBottom: "16px" };
const footer = { color: "#A09687", fontSize: "12px" };
