# Overview 
Are you just getting started with SignalWire? **No problem!** You can fork the code in Github and run this script in order to pre-load your space with XML Bins for the most common use cases such as call forwarding, message forwarding, recording a voicemail, setting up conferences, and more. Read more about how XML bins work [here](https://developer.signalwire.com/apis/docs/creating-and-using-bins-xml). 

# What do I need to run this code?

You will need the [SignalWire Python SDK](https://developer.signalwire.com/compatibility-api/reference/client-libraries-and-sdks#python) as well as your authentication variables which can easily be found in the **API** tab of your SignalWire Space. 

View [here](https://developer.signalwire.com/apis/docs/navigating-your-space#api) to see more about navigating your space and how to find authentication variables. 

You will need [Python](https://www.python.org/downloads/) installed to run this script. 

# How to Run Application 
After navigating to the GitHub repo, click the green Code button. 

Click **Clone with HTTPS** to get a URL to the repo. 
![Clone Button](src/code-button.png)

Now open Terminal or Command Prompt and type `git clone https://github.com/url_copied_above`, then press enter. This will put the code in a folder on your computer. Open the folder in your preferred text editor, IDE, or on Terminal by entering `cd folder_name`. 
![Clone with HTTPS Button](src/https-url-clone.png)

Open the `example.env` file, change the name to `.env` and change the contents to point to your correct Project ID, API Token, and Space URL. When complete, it should look something like this: 

```
SIGNALWIRE_SPACE=YOURSPACE.signalwire.com
SIGNALWIRE_PROJECT=Some-Alpha-Numeric-String
SIGNALWIRE_TOKEN=PTxxxxxxxxxxxxxxxxxxxxxxxxx
```

If you do not already have Python3 installed, follow the [steps](https://www.python.org/downloads/) to install Python on your OS. If you do, you can now type `python3 main.py` to run the script and load all of the example bins into your space. 


# Step by Step Code Content 
This Github repo will have 4 parts to it: 
* readme.MD - a condensed version of the writeup here
* main.py - the main python file that is reading the bins.json file and sending the create XML bin http request 
* bins.json - the file that contains a JSON of bins with the name and content for each 
* example.env - this is the template for your environment variables, replace with your own tokens and change file name to .env

The bins.json file does not need to be touched - it has been prefilled with XML Bins for the most common use cases. 

# main.py 
The first section of this short snippet involves importing all the required libraries, grabbing our authentication variables from the .env file, and authenticating the SignalWire client. 

```python
import requests
import json
from signalwire.rest import Client as signalwire_client
from dotenv import load_dotenv
import os
from requests.auth import HTTPBasicAuth

load_dotenv()

projectID = os.getenv('SIGNALWIRE_PROJECT')
authToken = os.getenv('SIGNALWIRE_TOKEN')
spaceURL = os.getenv('SIGNALWIRE_SPACE')

# import client
client = signalwire_client(projectID, authToken, signalwire_space_url = spaceURL)
```

The next section will use the python requests library to make sending a POST request to the SignalWire server extremely simple. This function takes the bin `title` and `bin` content as parameters and uses our authentication variables to set the URL. We will define the payload as the `title` and `content` parameters and define API headers as indicated by the [API documentation](https://developer.signalwire.com/compatibility-api/reference/create_laml_bins). Lastly, we will use the information to make a POST request and return the bin details to the console. 

```python
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
```

The last section reads the bins.json file into a python dictionary and loops through it to send the Create Bin request for each bin. 
```python 
# read json menu in and call function for each pair
with open('bins.json', "r") as read_file:
    binDict = json.load(read_file)

for i in binDict['bins']:
    binName = i['name']
    binContents = i['content']
    send_request(binName, binContents)
```

# Wrap up 
That's all there is to it! This super simple script allows you to quickly load your space with convenient bins for many common use cases and you only need to replace the path variables and phone numbers within them for them to work. To see more about how to use each individual bin and see a walkthrough of each use case, check the individual links below: 

* https://developer.signalwire.com/apis/docs/how-to-forward-calls
* https://developer.signalwire.com/apis/docs/how-to-set-up-voicemail
* https://developer.signalwire.com/apis/docs/how-to-gather-keypad-input-from-user
* https://developer.signalwire.com/apis/docs/how-to-use-conferences
* https://developer.signalwire.com/apis/docs/how-to-use-queues
* https://developer.signalwire.com/apis/docs/how-to-forward-messages


# Sign Up Here

If you would like to test this example out, you can create a SignalWire account and space [here](https://m.signalwire.com/signups/new?s=1).

Please feel free to reach out to us on our [Community Slack](https://join.slack.com/t/signalwire-community/shared_invite/zt-sjagsni8-AYKmOMhP_1sVMvz9Ya_r0Q) or create a Support ticket if you need guidance!