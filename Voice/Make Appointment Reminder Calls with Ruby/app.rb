require 'dotenv/load'
require 'sinatra'
require "sinatra/reloader" if development?
require 'signalwire'

config = JSON.parse(File.read('config.json'))

def place_call(to_number)
  client = Signalwire::REST::Client.new ENV['SIGNALWIRE_PROJECT_KEY'], ENV['SIGNALWIRE_TOKEN'], signalwire_space_url: ENV['SIGNALWIRE_SPACE']

  call = client.calls.create(
    url: ENV['APP_DOMAIN'] + '/reminder',
    to: to_number,
    from: ENV['FROM_NUMBER']
  )


end

def send_reminder(text, to_number)
  client = Signalwire::REST::Client.new ENV['SIGNALWIRE_PROJECT_KEY'], ENV['SIGNALWIRE_TOKEN'], signalwire_space_url: ENV['SIGNALWIRE_SPACE']

  msg = client.messages.create(
    to: to_number,
    from: ENV['FROM_NUMBER'],
    body: text
  )
end

def say_date_and_time(say_object, date, time)
  say_object.say_as(date, interpretAs: 'date', format: 'mdy')
  say_object.add_text(' at ')
  say_object.say_as(time, interpretAs: 'time', format: 'hms12')
end

get '/' do
  @reminders = config['reminders']
  erb :index
end

get '/call' do
  reminder = config['reminders'].first
  place_call(reminder['to'])

  redirect '/'
end

post '/reminder' do
  puts params

  reminder = config['reminders'].first
  response = Signalwire::Sdk::VoiceResponse.new

  if params['Digits'] || params['SpeechResult']
    if params['Digits'] == '1' || params['SpeechResult'].match?(/yes/)
      response.say(message: "Thank you for confirming your appointment. Goodbye!")
      response.hangup
    elsif params['Digits'] == '2' || params['SpeechResult'].match?(/no/)
      response.redirect('/choose')
    else
      # we didn't understand
      response.say(message: "Sorry, I could not understand you.");
      response.redirect('/reminder?retry=1')
    end
  else

    response.say(message: "Hello, #{reminder['name']}") unless params['retry']
    response.say(message: "We are calling you from the dental clinic to remind you about your appointment on ") do |say|
      say_date_and_time(say, reminder['date'], reminder['time'])
    end

    response.gather(input: 'speech dtmf', timeout: 5, num_digits: 1) do |gather|
      message = 'Do you confirm that date and time?'
      message += 'Press 1 or say yes to confirm, or press 2 or say no to choose another option.' if params['retry'] == '1'
      gather.say(message: message)
    end
  end
  response.to_s
end

post '/choose' do
  reminder = config['reminders'].first
  response = Signalwire::Sdk::VoiceResponse.new

  words = %w{first second}
  if params['Digits'] || params['SpeechResult']
    # we have input
    picked = nil
    if params['Digits'] == '1' || params['SpeechResult'].match?(/first/)
      picked = config['available'][0]
    elsif params['Digits'] == '2' || params['SpeechResult'].match?(/second/)
      picked = config['available'][1]
    end

    if picked
      response.say(message: "Thank you! Your new appointment is on ") do |say|
        say_date_and_time(say, picked['date'], picked['time'])
      end
      send_reminder("Your appointment at the Dental Clinic is on #{picked['date']} at #{picked['time']}.", reminder['to'])
    else
      # we didn't understand
      response.say(message: "Sorry, let's try again.");
      response.redirect('/choose')
    end
  else
    response.say(message: "Let's pick another appointment for you. ")

    response.gather(input: 'speech dtmf', timeout: 5, num_digits: 1) do |gather|
      gather.say do |say|
        config['available'].each_with_index do |slot, i|
          say.add_text("press #{i + 1} or say #{words[i]} for")
          say_date_and_time(say, slot['date'], slot['time'])
        end
      end
    end
  end

  response.to_s
end