-- Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    image_url TEXT,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.testimonials
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.testimonials
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Seed initial data
INSERT INTO public.testimonials (name, role, image_url, content, rating)
VALUES
    ('Priya Sharma', 'IIT-JEE Qualified 2024', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', 'Ruchi ma''am''s teaching style is exceptional. Her organic chemistry concepts cleared all my doubts. I secured AIR 850 in JEE Advanced!', 5),
    ('Rahul Verma', 'NEET 2024 - 650+ Score', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', 'The best chemistry classes in the city! The mock tests and practice papers helped me tremendously in NEET preparation.', 5),
    ('Ananya Singh', 'Class 12 - 98% in Chemistry', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', 'I was struggling with physical chemistry before joining here. Now it''s my strongest subject! Thank you Ruchi ma''am.', 5),
    ('Arjun Patel', 'Engineering Student', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', 'Even for engineering chemistry, the foundation I built here helped me score consistently well in college.', 5);
