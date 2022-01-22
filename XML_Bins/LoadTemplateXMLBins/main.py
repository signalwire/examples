import requests
import json
from signalwire.rest import Client as signalwire_client
from dotenv import load_dotenv
import os
from requests.auth import HTTPBasicAuth

load_dotenv()

# load auth variables from .env
projectID = os.getenv('SIGNALWIRE_PROJECT')
authToken = os.getenv('SIGNALWIRE_TOKEN')
spaceURL = os.getenv('SIGNALWIRE_SPACE')

# import client
client = signalwire_client(projectID, authToken, signalwire_space_url = spaceURL)

# define function to send http request
def send_request(title, content):
    url = f"https://{spaceURL}/api/laml/2010-04-01/Accounts/{projectID}/LamlBins"
    payload = f"Name={title}&Contents={content}"

    headers = {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    response = requests.request("POST", url, headers=headers, data=payload, auth=HTTPBasicAuth(projectID, authToken))
    print(f"Adding the {title} bin - details below.")
    print(response.text)

# read json menu in and call function for each pair
with open('bins.json', "r") as read_file:
    binDict = json.load(read_file)

# rotate through dictionary and send request using name/contents from each bin
for i in binDict['bins']:
    binName = i['name']
    binContents = i['content']
    send_request(binName, binContents)







