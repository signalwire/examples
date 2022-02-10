from flask import Flask, redirect, request, render_template
import pandas as pd
import os
from dotenv import load_dotenv
import short_url
from datetime import datetime
import datetime


app = Flask(__name__)
load_dotenv()


# get environment variables from .env file
hostName = os.getenv('SIGNALWIRE_HOST_NAME')


# generate shortened URL using encoding and store in CSV
def generateShortenedURL(fullURL, keyword):
    # read in csv using pandas
    shortenedUrls = pd.read_csv('shortUrls.csv')
    object_id = len(shortenedUrls)

    shortened_url = f"{hostName}{keyword}/{short_url.encode_url(object_id, min_length=3)}"
    shortenedUrls.loc[len(shortenedUrls.index)] = [fullURL, shortened_url, datetime.date.today(), 'Not Used Yet', 0]
    shortenedUrls.to_csv('shortUrls.csv', index=None)
    return shortened_url

# delete shortened URL from CSV
def deleteShortenedURL(fullURL):
    # read in csv using pandas
    shortenedUrls = pd.read_csv('shortUrls.csv')

    # delete row with matching fullURL
    shortenedUrls.drop(shortenedUrls[shortenedUrls['Full URL'] == fullURL].index, inplace=True)
    shortenedUrls.to_csv('shortUrls.csv', index=None)
    return 'shortened URL deleted'


# handle inbound shortened url requests and redirect to full URL
@app.route("/<name>/<char>", methods=('GET', 'POST'))
def redirectShortCode(char, name):
    decoded_id = short_url.decode_url(char)
    shortenedUrls = pd.read_csv('shortUrls.csv')
    fullURL = shortenedUrls.loc[decoded_id, 'Full URL']
    shortenedUrls.loc[decoded_id, 'Last Clicked'] = datetime.date.today()
    shortenedUrls.loc[decoded_id, 'Times Clicked'] = shortenedUrls.loc[decoded_id, 'Times Clicked'] + 1
    shortenedUrls.to_csv('shortUrls.csv', index=None)

    return redirect(fullURL, code=302)

# handle url shortener
@app.route('/', methods=['POST', 'GET'])
def shortenedURLs():
    # generate new shortened URL
    if request.args.get('fullURL'):
        fullURL = request.args.get('fullURL')
        if request.args.get('keyword'):
            keyword = request.args.get('keyword')
            generateShortenedURL(fullURL, keyword)
        else:
            keyword = 'sc'
            generateShortenedURL(fullURL, keyword)

    # delete shortened URL
    if request.args.get('delURL'):
        delURL = request.args.get('delURL')
        deleteShortenedURL(delURL)

    data = pd.read_csv('shortUrls.csv')
    urls = data['Full URL'].tolist()

    return render_template('urlShortener.html', table=data.to_html(
        classes=["table", "table-striped", "table-dark", "table-hover", "table-condensed", "table-fixed"], index=False),
                           urls=urls)


if __name__ == "__main__":
    app.run()