FROM ruby:2.7

RUN bundle config --global frozen 1

WORKDIR /app

COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY app.rb .

EXPOSE 8080

CMD ["bundle", "exec", "ruby", "app.rb"]