class Puzzle < ApplicationRecord
  mount_uploader :image, PuzzleUploader
  validates :title, presence: true,
                      length: { minimum: 5 }

end
