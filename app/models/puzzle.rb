class Puzzle < ApplicationRecord
  # mount_uploader :image, PuzzleUploader
  validates :title, presence: true,
                      length: { minimum: 5 }
  validates :image, presence: true
  validates :difficulty, numericality: { less_than_or_equal_to: 20 }
  belongs_to :user, optional: true
end
