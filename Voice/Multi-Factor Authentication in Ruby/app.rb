require 'dotenv/load'
require 'signalwire/sdk'
require 'sinatra'
require 'net/http'
require 'uri'
require 'json'
require "sinatra/reloader" if development?

def make_request(action, payload)
  uri = URI.parse("https://#{ENV['SIGNALWIRE_SPACE']}/api/relay/rest/mfa#{action}")

  request = Net::HTTP::Post.new(uri)
  request.basic_auth(ENV['SIGNALWIRE_PROJECT_KEY'], ENV['SIGNALWIRE_TOKEN'])
  request.set_form_data(payload)

  response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https", verify_mode: OpenSSL::SSL::VERIFY_NONE) do |http|
    http.request(request)
  end

  if response.code.to_i < 400
    return JSON.parse(response.body)
  else
    return { "success" => false }
  end
end

get '/' do
  erb :index
end

post '/' do
  if params[:phone]
    # request the token
    payload = {
      "to" => params[:phone]
    }
    result = make_request("/#{params[:mode]}", payload)
    @verify = result["id"]
  elsif params[:verify]
    payload = {
      "token" => params[:code]
    }
    result = make_request("/#{params[:verify]}/verify", payload)

    @success = result["success"]
    @verify = params[:verify]
  end

  erb :index
end