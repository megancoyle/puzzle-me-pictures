Rails.application.routes.draw do

  resources :puzzles

  root 'welcome#index'
end
