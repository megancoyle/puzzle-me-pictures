class AddDifficultyToPuzzles < ActiveRecord::Migration[5.0]
  def change
    add_column :puzzles, :difficulty, :integer
  end
end
