-- Create healthcare_providers table for buyers
CREATE TABLE IF NOT EXISTS healthcare_providers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    profession TEXT NOT NULL,
    license_number TEXT NOT NULL,
    license_verified BOOLEAN DEFAULT false,
    business_name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_healthcare_providers_license_number ON healthcare_providers(license_number);

-- Create trigger for updated_at
CREATE TRIGGER update_healthcare_providers_updated_at
    BEFORE UPDATE ON healthcare_providers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security (RLS)
ALTER TABLE healthcare_providers ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Healthcare providers are readable by everyone
CREATE POLICY "Healthcare providers are viewable by everyone" ON healthcare_providers
    FOR SELECT USING (true);

-- Only authenticated users can insert/update their own provider record
CREATE POLICY "Users can insert their own healthcare provider record" ON healthcare_providers
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own healthcare provider record" ON healthcare_providers
    FOR UPDATE USING (auth.uid() = id);

-- Function to create healthcare_providers table if it doesn't exist via RPC
CREATE OR REPLACE FUNCTION create_healthcare_providers_if_not_exists()
RETURNS void AS $$
BEGIN
    -- This function exists as a placeholder since we've already created the table
    -- In a real application this would dynamically create the table if needed
    -- But for our purposes, we can just return
    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 