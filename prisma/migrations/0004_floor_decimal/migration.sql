-- Allow half-floor values (e.g. 1.5) from broker listings
ALTER TABLE "PropertyAnalysis" ALTER COLUMN "floor" TYPE DECIMAL(4,1) USING "floor"::decimal;
