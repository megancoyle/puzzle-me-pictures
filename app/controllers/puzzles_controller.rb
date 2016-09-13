class PuzzlesController < ApplicationController

  def show
    @puzzle = Puzzle.find(params[:id])
  end

  def new
  end

  def create
    @puzzle = Puzzle.new(puzzle_params)

    @puzzle.save
    redirect_to @puzzle
  end

  private
    def puzzle_params
      params.require(:puzzle).permit(:title, :img_url)
    end

end
