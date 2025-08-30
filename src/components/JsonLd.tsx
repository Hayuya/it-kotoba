'use client';

import { Thing, WithContext } from 'schema-dts';

type JsonLdProps = {
  schema: WithContext<Thing>;
};

export default function JsonLd({ schema }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}