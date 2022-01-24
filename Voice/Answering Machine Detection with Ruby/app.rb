require 'rubygems'
require 'sinatra'
require 'signalwire'

set :port, 8080

post '/start' do
  response = Signalwire::Sdk::VoiceResponse.new

  case params[:AnsweredBy]
  when 'machine_end_other', 'machine_end_silence', 'machine_end_beep'
    puts "It's a machine!"
    # put in a little pause to allow the recording to start on the other end
    response.pause(length: 1)
    # replace messsage with whatever voicemail you want to leave
    response.say(message: "Hello! This is the County Medical Center. We are calling you to confirm your doctor appointment. Please call us back as soon as possible.")
    response.hangup
  when 'human'
    puts "We got ourselves a live human here!"
    response.dial do |dial|
      # defaulting to calling a time voice announcement number as an example
      dial.number(ENV.fetch('AGENT_NUMBER', '+12027621401'))
    end
  end

  # debug the LAML
  puts response.to_s
  response.to_s
end