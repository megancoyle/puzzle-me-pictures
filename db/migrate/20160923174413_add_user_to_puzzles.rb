class AddUserToPuzzles < ActiveRecord::Migration[5.0]
  def change
    add_reference :puzzles, :user, foreign_key: true
  end
end
