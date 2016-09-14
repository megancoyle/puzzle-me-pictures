class Puzzle < ApplicationRecord
  mount_uploader :image, PuzzleUploader
  validates :title, presence: true,
                      length: { minimum: 5 }
  validates :image, file_size: { less_than_or_equal_to: 100.kilobytes },
            file_content_type: { allow: ['image/jpeg', 'image/png'] }
end
