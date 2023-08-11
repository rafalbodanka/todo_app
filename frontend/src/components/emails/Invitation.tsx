import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import * as React from "react";

export default function Email() {
  return (
    <Html>
      <Head />
      <Preview>preview</Preview>
      <Tailwind>
        <Body
          className="bg-white my-auto mx-auto font-Roboto"
          style={{ backgroundColor: "white" }}
        >
          <Heading className="text-white">Siemaneczko łobuzie</Heading>
        </Body>
      </Tailwind>
    </Html>
  );
}
