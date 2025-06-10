import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgres://dev:dev@192.168.10.129:5432/anthony_salesordergenerator',
  },
} satisfies Config;