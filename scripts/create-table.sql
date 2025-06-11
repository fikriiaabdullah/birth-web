-- Create the birthday messages table
CREATE TABLE IF NOT EXISTS birthday_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create photos table for birthday gallery
CREATE TABLE IF NOT EXISTS birthday_photos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample messages
INSERT INTO birthday_messages (name, message) VALUES 
('Player One', 'Happy Birthday! Level up to another amazing year! 🎮✨'),
('Game Master', 'Wishing you power-ups, extra lives, and endless joy! 🍄🎂');

-- Insert sample photos
INSERT INTO birthday_photos (title, description, image_url) VALUES 
('Birthday Adventure', 'Ready for another year of adventures!', '/placeholder.svg?height=300&width=400'),
('Level Complete', 'Another year, another level mastered!', '/placeholder.svg?height=300&width=400'),
('Power-Up Moment', 'Collecting memories like coins!', '/placeholder.svg?height=300&width=400');
