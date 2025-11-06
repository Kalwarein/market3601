-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Clear existing admin_secrets and re-insert with proper bcrypt hashes
DELETE FROM admin_secrets;

-- Insert the two admin passphrases as bcrypt hashes
INSERT INTO admin_secrets (label, passhash)
VALUES 
  ('step1', crypt('#market360762635375363', gen_salt('bf', 10))),
  ('step2', crypt('#market360848844747477', gen_salt('bf', 10)));