-- Load sqlite-vec extension
SELECT load_extension('sqlite-vec');

-- Create a function to calculate vector similarity
CREATE FUNCTION vector_similarity(vec1 TEXT, vec2 TEXT) 
RETURNS REAL AS
BEGIN
  RETURN cosine_similarity(json(vec1), json(vec2));
END;
