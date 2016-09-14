Rails.application.routes.draw do

  devise_for :users
  resources :puzzles

  root 'welcome#index'
end
