-- Create a secure function to delete a course and all its related data
-- This function runs with SECURITY DEFINER to bypass RLS policies that might prevent
-- admins from deleting user-owned records (like purchases)

-- Drop the old function first since we are renaming the parameter
DROP FUNCTION IF EXISTS delete_course_completely(UUID);

CREATE OR REPLACE FUNCTION delete_course_completely(p_course_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- 1. Validate that the executing user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: Only admins can delete courses';
  END IF;

  -- 2. Delete related purchases (Foreign Key: course_id)
  DELETE FROM purchases WHERE course_id = p_course_id;

  -- 3. Delete related lessons (Foreign Key: course_id)
  -- Note: If lessons have their own dependent records (like progress), 
  -- those should be set to cascade delete in schema. 
  -- If not, we might need to delete them here too.
  DELETE FROM lessons WHERE course_id = p_course_id;
  
  -- 4. Delete the course itself
  DELETE FROM courses WHERE id = p_course_id;
END;
$$;
