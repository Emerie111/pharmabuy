-- Create tables for pharmaceutical marketplace

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create generic_drugs table
CREATE TABLE generic_drugs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    indication TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create branded_products table
CREATE TABLE branded_products (
    id TEXT PRIMARY KEY,
    generic_id TEXT NOT NULL REFERENCES generic_drugs(id) ON DELETE CASCADE,
    brand_name TEXT NOT NULL,
    manufacturer TEXT NOT NULL,
    strength TEXT NOT NULL,
    dosage_form TEXT NOT NULL,
    pack_size TEXT NOT NULL,
    verified BOOLEAN DEFAULT false,
    rating DECIMAL(3,1) DEFAULT 0,
    image TEXT NOT NULL,
    bioequivalence DECIMAL(5,2),
    nafdac_number TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('prescription', 'otc')),
    date_added TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    country_of_origin TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create suppliers table
CREATE TABLE suppliers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    verified BOOLEAN DEFAULT false,
    logo TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    website TEXT,
    founded_year INTEGER NOT NULL,
    certifications TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create supplier_products table (junction table for suppliers and branded products)
CREATE TABLE supplier_products (
    id TEXT PRIMARY KEY,
    supplier_id TEXT NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    branded_product_id TEXT NOT NULL REFERENCES branded_products(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL,
    location TEXT NOT NULL,
    min_order INTEGER NOT NULL,
    bulk_discounts JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(supplier_id, branded_product_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_generic_drugs_name ON generic_drugs(name);
CREATE INDEX idx_branded_products_generic_id ON branded_products(generic_id);
CREATE INDEX idx_branded_products_brand_name ON branded_products(brand_name);
CREATE INDEX idx_supplier_products_supplier_id ON supplier_products(supplier_id);
CREATE INDEX idx_supplier_products_branded_product_id ON supplier_products(branded_product_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_generic_drugs_updated_at
    BEFORE UPDATE ON generic_drugs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_branded_products_updated_at
    BEFORE UPDATE ON branded_products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
    BEFORE UPDATE ON suppliers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_supplier_products_updated_at
    BEFORE UPDATE ON supplier_products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security (RLS)
ALTER TABLE generic_drugs ENABLE ROW LEVEL SECURITY;
ALTER TABLE branded_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_products ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Generic drugs are readable by everyone
CREATE POLICY "Generic drugs are viewable by everyone" ON generic_drugs
    FOR SELECT USING (true);

-- Branded products are readable by everyone
CREATE POLICY "Branded products are viewable by everyone" ON branded_products
    FOR SELECT USING (true);

-- Suppliers are readable by everyone
CREATE POLICY "Suppliers are viewable by everyone" ON suppliers
    FOR SELECT USING (true);

-- Supplier products are readable by everyone
CREATE POLICY "Supplier products are viewable by everyone" ON supplier_products
    FOR SELECT USING (true);

-- Only authenticated users can insert/update/delete
CREATE POLICY "Authenticated users can insert generic drugs" ON generic_drugs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update generic drugs" ON generic_drugs
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete generic drugs" ON generic_drugs
    FOR DELETE USING (auth.role() = 'authenticated');

-- Similar policies for other tables...

-- Create roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Create user_roles table
CREATE TABLE user_roles (
    user_id TEXT NOT NULL,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Insert default roles
INSERT INTO roles (name) VALUES ('supplier'), ('healthcare_provider'); 