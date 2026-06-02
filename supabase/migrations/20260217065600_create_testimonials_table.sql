-- Create testimonials table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON public.testimonials
    FOR SELECT
    USING (true);

-- Create policy for admin/authenticated insert/update/delete (optional, but good for future)
-- For now, we'll allow authenticated users to view only (covered by public policy)
-- Adding specific admin policies would require an admin role check function or similar

-- Seed initial data
INSERT INTO public.testimonials (name, role, content, rating, image_url)
VALUES
    ('Priya Sharma', 'Class 12 Student', 'The structured approach to organic chemistry really helped me grasp the concepts. I scored 95/100 in my boards thanks to Ruchi Ma''am!', 5, null),
    ('Rahul Verma', 'JEE Aspirant', 'The test series is exceptionally good. It covers all types of questions asked in JEE Mains. Highly recommended!', 5, null),
    ('Sneha Gupta', 'NEET Aspirant', 'Chemistry was my weakest subject until I joined these classes. The notes are comprehensive and easy to understand.', 5, null),
    ('Amit Patel', 'Class 11 Student', 'I love the interactive sessions. Doubts are cleared instantly, and the learning environment is very supportive.', 4, null);
