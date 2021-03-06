class PuzzlesController < ApplicationController
  before_action :authenticate_user!, :except => [:index, :show]
  def index
    @puzzles = Puzzle.order("title").page(params[:page]).per_page(6)
  end

  def show
    @puzzle = Puzzle.find(params[:id])
  end

  def new
    @puzzle = Puzzle.new
  end

  def edit
    @puzzle = Puzzle.find(params[:id])
  end

  def create
    @puzzle = Puzzle.new(puzzle_params)
    @puzzle.user_id = @current_user.id if current_user

    if @puzzle.save
      redirect_to @puzzle
    else
      render 'new'
    end
  end

  def update
    @puzzle = Puzzle.find(params[:id])

    if @puzzle.update(puzzle_params)
      redirect_to @puzzle
    else
      render 'edit'
    end
  end

  def destroy
    @puzzle = Puzzle.find(params[:id])
    @puzzle.destroy

    redirect_to puzzles_path
  end

  private
    def puzzle_params
      params.require(:puzzle).permit(:title, :image, :difficulty, :user)
    end

end
