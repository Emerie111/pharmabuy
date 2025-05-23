-- Create healthcare_providers table
CREATE TABLE IF NOT EXISTS healthcare_providers (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    profession TEXT NOT NULL,
    license_number TEXT NOT NULL,
    license_verified BOOLEAN NOT NULL DEFAULT FALSE,
    business_name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE healthcare_providers ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own data
CREATE POLICY "Users can view their own healthcare provider data"
    ON healthcare_providers
    FOR SELECT
    USING (auth.uid() = id);

-- Policy for users to insert their own data
CREATE POLICY "Users can insert their own healthcare provider data"
    ON healthcare_providers
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Policy for users to update their own data
CREATE POLICY "Users can update their own healthcare provider data"
    ON healthcare_providers
    FOR UPDATE
    USING (auth.uid() = id);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update the updated_at timestamp on row update
CREATE TRIGGER update_healthcare_providers_timestamp
BEFORE UPDATE ON healthcare_providers
FOR EACH ROW
EXECUTE FUNCTION update_timestamp(); 