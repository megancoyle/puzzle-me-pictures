class RenameImageColumn < ActiveRecord::Migration[5.0]
  def change
    rename_column :puzzles, :img_url, :image
  end
end
