FROM ruby:2.7

WORKDIR /app
COPY . /app
RUN bundle install

CMD ["bundle", "exec", "ruby", "app.rb", "-o", "0.0.0.0"]