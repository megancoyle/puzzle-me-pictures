class CreatesController < ApplicationController
  before_action :authenticate_user!

  def index
    puzzles = Puzzle.all
    @user_created = []
    puzzles.each do |puzzle|
      index = puzzle.user_id
      if index == current_user.id
        @user_created.push(puzzle)
      end
    end

  end
end
