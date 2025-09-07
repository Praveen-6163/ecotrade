/*
  # Initial EcoTrade Schema Setup

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `email` (text)
      - `credits_owned` (integer, default 0)
      - `total_co2_offset` (integer, default 0)
      - `badges` (text array, default empty array)
      - `created_at` (timestamp)

    - `projects`
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (text)
      - `price_per_credit` (numeric)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamp)

    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `project_id` (uuid, references projects)
      - `type` (text, buy or sell)
      - `quantity` (integer)
      - `total_cost` (numeric)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for reading public project data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  credits_owned integer DEFAULT 0,
  total_co2_offset integer DEFAULT 0,
  badges text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  price_per_credit numeric NOT NULL,
  description text NOT NULL,
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  type text CHECK (type IN ('buy', 'sell')) NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  total_cost numeric NOT NULL CHECK (total_cost >= 0),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policies for projects (public read access)
CREATE POLICY "Anyone can read projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for transactions
CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert sample projects
INSERT INTO projects (name, type, price_per_credit, description, image_url) VALUES
  ('Amazon Rainforest Protection', 'Forestry', 12.50, 'Protect 1000 hectares of Amazon rainforest from deforestation', 'https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg'),
  ('Wind Energy California', 'Renewable Energy', 15.00, 'Support wind energy generation in California reducing 50,000 tons CO2 annually', 'https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg'),
  ('Solar Farm India', 'Solar Energy', 18.75, 'Fund solar energy infrastructure in rural India providing clean electricity', 'https://images.pexels.com/photos/2800832/pexels-photo-2800832.jpeg'),
  ('Ocean Plastic Cleanup', 'Waste Management', 22.00, 'Remove plastic waste from oceans and convert to sustainable materials', 'https://images.pexels.com/photos/3119972/pexels-photo-3119972.jpeg'),
  ('Reforestation Kenya', 'Forestry', 8.50, 'Plant native trees in Kenya providing employment and carbon sequestration', 'https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg'),
  ('Methane Capture Landfill', 'Methane Reduction', 25.00, 'Capture methane emissions from landfills and convert to clean energy', 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_total_co2_offset ON profiles(total_co2_offset DESC);