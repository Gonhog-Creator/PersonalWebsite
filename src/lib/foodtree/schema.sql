-- FoodTree database schema
-- Run this in your Vercel Postgres console after creating a database

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Ingredients table
CREATE TABLE IF NOT EXISTS foodtree_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL DEFAULT 'plant' CHECK (source IN ('plant', 'animal', 'other')),
  animal_type TEXT,
  is_source_animal BOOLEAN NOT NULL DEFAULT FALSE,
  preparation_method TEXT,
  parent_ingredient_ids UUID[] DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Dishes table
CREATE TABLE IF NOT EXISTS foodtree_dishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  cooking_method TEXT,
  ingredients JSONB NOT NULL DEFAULT '[]',
  tags TEXT[] DEFAULT '{}',
  recipe_steps TEXT[] DEFAULT '{}',
  serving_size TEXT,
  cooking_time INTEGER,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Submissions table
CREATE TABLE IF NOT EXISTS foodtree_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('ingredient', 'dish')),
  data JSONB NOT NULL,
  submitted_by TEXT NOT NULL DEFAULT 'Anonymous',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  notes TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ingredients_source ON foodtree_ingredients(source);
CREATE INDEX IF NOT EXISTS idx_ingredients_name_lower ON foodtree_ingredients(LOWER(name));
CREATE INDEX IF NOT EXISTS idx_dishes_name_lower ON foodtree_dishes(LOWER(name));
CREATE INDEX IF NOT EXISTS idx_submissions_status ON foodtree_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_type ON foodtree_submissions(type);
