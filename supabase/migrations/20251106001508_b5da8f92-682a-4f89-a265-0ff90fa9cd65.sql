-- Create verify_password function for secure password verification
CREATE OR REPLACE FUNCTION verify_password(input_pass text, stored_hash text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN stored_hash = crypt(input_pass, stored_hash);
END;
$$;