-- Grant all permissions to insurance_user on public schema
GRANT ALL ON SCHEMA public TO insurance_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO insurance_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO insurance_user;

-- Also grant default privileges for future tables and sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO insurance_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO insurance_user;

-- Verify the grants
\dp
