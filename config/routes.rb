Rails.application.routes.draw do
  root 'posts#new'

  # TO DO: Create a proper admin controller.
  get '/admin',                    to: 'home#show'

  # boards
  get  '/boards',                 to: 'boards#index'
  get  '/boards/new',             to: 'boards#new'
  post '/boards',                 to: 'boards#create'
  get  '/boards/validate_key',    to: 'boards#validate_key'
  get  '/boards/:key',            to: 'boards#show'

  # posts
  get  '/posts/new',              to: 'posts#new'
  get  '/posts/validate_key',     to: 'posts#validate_key'
  post '/posts',                  to: 'posts#create'
end
