
-- Add date field to bookings table and update status options
ALTER TABLE public.bookings 
ADD COLUMN travel_date DATE,
ALTER COLUMN status DROP DEFAULT,
ALTER COLUMN status SET DEFAULT 'pending';

-- Drop existing constraint and add new one with more status options
ALTER TABLE public.bookings 
DROP CONSTRAINT IF EXISTS bookings_status_check;

ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_status_check 
CHECK (status IN ('pending', 'confirmed', 'cancelled', 'rejected'));

-- Add payment related fields
ALTER TABLE public.bookings 
ADD COLUMN payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
ADD COLUMN payment_method TEXT,
ADD COLUMN payment_reference TEXT,
ADD COLUMN total_amount DECIMAL(10,2);

-- Update admin policies for bookings to allow updates
CREATE POLICY "Admins can update all bookings" ON public.bookings
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
