Rails.application.routes.draw do

  devise_for :users
  resources :puzzles
  get 'creates' => 'creates#index' 
  root 'welcome#index'
end
