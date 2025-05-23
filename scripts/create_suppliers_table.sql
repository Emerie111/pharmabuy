-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    logo TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    website TEXT,
    founded_year INTEGER NOT NULL,
    certifications TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own data
CREATE POLICY "Users can view their own supplier data"
    ON suppliers
    FOR SELECT
    USING (auth.uid() = id);

-- Policy for users to insert their own data
CREATE POLICY "Users can insert their own supplier data"
    ON suppliers
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Policy for users to update their own data
CREATE POLICY "Users can update their own supplier data"
    ON suppliers
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
CREATE TRIGGER update_suppliers_timestamp
BEFORE UPDATE ON suppliers
FOR EACH ROW
EXECUTE FUNCTION update_timestamp(); 