/*
  # Add Sale Orders Table for Marketplace

  1. New Tables
    - `sale_orders`
      - `id` (uuid, primary key)
      - `seller_id` (uuid, references profiles)
      - `project_id` (uuid, references projects)
      - `quantity` (integer, must be positive)
      - `price_per_credit` (numeric, must be positive)
      - `total_value` (numeric, calculated field)
      - `status` (text, enum: active/completed/cancelled)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `sale_orders` table
    - Add policies for authenticated users to manage their own orders
    - Add policy for all users to read active orders

  3. Indexes
    - Index on seller_id for performance
    - Index on status for marketplace queries
    - Index on created_at for ordering
*/

CREATE TABLE IF NOT EXISTS sale_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  quantity integer NOT NULL CHECK (quantity > 0),
  price_per_credit numeric NOT NULL CHECK (price_per_credit > 0),
  total_value numeric NOT NULL CHECK (total_value > 0),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE sale_orders ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sale_orders_seller_id ON sale_orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_sale_orders_status ON sale_orders(status);
CREATE INDEX IF NOT EXISTS idx_sale_orders_created_at ON sale_orders(created_at DESC);

-- RLS Policies
CREATE POLICY "Users can insert own sale orders"
  ON sale_orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can read own sale orders"
  ON sale_orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = seller_id);

CREATE POLICY "Users can update own sale orders"
  ON sale_orders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id);

CREATE POLICY "Anyone can read active sale orders"
  ON sale_orders
  FOR SELECT
  TO authenticated
  USING (status = 'active');