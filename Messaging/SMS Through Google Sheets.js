var CUSTOMER_PHONE_NUMBER = 0;
var CUSTOMER_NAME = 1;
var AMOUNT_DUE = 2;
var PAYMENT_DUE_DATE = 3;
var PAYMENT_LINK = 4;    // A URL where the payment can be made
var PAYMENT_INFO = 5;    // Details of the service or product
var MESSAGE_STATUS = 6;  // Whether the SMS was sent or not

//Set your SignalWire credentials
var SIGNALWIRE_PROJECT_ID = 'placeholder';
var SIGNALWIRE_PHONE_NUMBER = 'placeholder';
var SIGNALWIRE_AUTH_TOKEN = 'placeholder';
var SIGNALWIRE_SPACE_URL = 'placeholder';

var ui = SpreadsheetApp.getUi();
var userProperties = PropertiesService.getUserProperties();

//Creating menu options for entering credentials and sending SMS
function onOpen() {
 ui.createMenu('Credentials')
   .addItem('Set SignalWire Project ID', 'setSignalWireProjectID')
   .addItem('Set SignalWire Auth Token', 'setSignalWireAuthToken')
   .addItem('Set SignalWire Space URL', 'setSignalWireURL')
   .addItem('Set SignalWire number', 'setSignalWirePhoneNumber')
   .addItem('Delete SignalWire Project ID', 'deleteSignalWireAccountSID')
   .addItem('Delete SignalWire Auth Token', 'deleteSignalWireAuthToken')
   .addItem('Delete SignalWire Space URL', 'deleteSignalWireURL')
   .addItem('Delete SignalWire phone number', 'deleteSignalWirePhoneNumber')
   .addToUi();
 ui.createMenu('Send SMS')
   .addItem('Send to all', 'sendSmsToAll')
   .addItem('Send to customers with due date 1st-15th', 'sendSmsByDateFilter')
   .addToUi();
};

//Defining what your Credentials menu option does
function setSignalWireProjectID(){
 var scriptValue = ui.prompt('Enter your SignalWire Project ID' , ui.ButtonSet.OK);
 userProperties.setProperty('SIGNALWIRE_PROJECT_ID', scriptValue.getResponseText());
};

function setSignalWireAuthToken(){
 var scriptValue = ui.prompt('Enter your SignalWire Auth Token' , ui.ButtonSet.OK);
 userProperties.setProperty('SIGNALWIRE_AUTH_TOKEN', scriptValue.getResponseText());
};

function setSignalWireURL(){
 var scriptValue = ui.prompt('Enter your SignalWire Space URL' , ui.ButtonSet.OK);
 userProperties.setProperty('SIGNALWIRE_SPACE_URL', scriptValue.getResponseText());
};

function setSignalWirePhoneNumber(){
 var scriptValue = ui.prompt('Enter your SignalWire phone number in this format: +12345678900' , ui.ButtonSet.OK);
 userProperties.setProperty('SIGNALWIRE_PHONE_NUMBER', scriptValue.getResponseText());
};

function deleteSignalWireProjectID(){
 userProperties.deleteProperty('SIGNALWIRE_PROJECT_ID');
};

function deleteSignalWireAuthToken(){
 userProperties.deleteProperty('SIGNALWIRE_AUTH_TOKEN');
};

function deleteSignalWireURL(){
 userProperties.deleteProperty('SIGNALWIRE_SPACE_URL');
};

function deleteSignalWirePhoneNumber(){
 userProperties.deleteProperty('SIGNALWIRE_PHONE_NUMBER');
};

//Defining what your Send SMS menu option does
function sendSms(customerPhoneNumber, amountDue, paymentLink, customerName, paymentInfo, paymentDueDate) {
 var signalwireProjectID = userProperties.getProperty('SIGNALWIRE_PROJECT_ID');
 var signalwireAuthToken = userProperties.getProperty('SIGNALWIRE_AUTH_TOKEN');
 var signalwirePhoneNumber = userProperties.getProperty('SIGNALWIRE_PHONE_NUMBER');
 var signalwireURL = userProperties.getProperty('SIGNALWIRE_SPACE_URL')
 var signalwireSend = 'https://' + signalwireURL + '/api/laml/2010-04-01/Accounts/' + signalwireProjectID + '/Messages.json';
 var authenticationString = signalwireProjectID + ':' + signalwireAuthToken;
 //Check to make sure the To number is in the correct E.164 format. If it's close, the script will fix it
 var tonumber = customerPhoneNumber.toString();
 if (tonumber.length == 11 && tonumber[0] == "1"){
    tonumber = "+" + tonumber}
 else if (tonumber.length == 12 && tonumber[0] == "+"){
    tonumber = tonumber}
 else if (tonumber.length == 10){
    tonumber = "+1" + tonumber}
 else{console.log('To number is invalid format.')};

 try {
   UrlFetchApp.fetch(signalwireSend, {
     method: 'post',
     headers: {
       Authorization: 'Basic ' + Utilities.base64Encode(authenticationString)
     },
     payload: {
       To: tonumber,
       Body: "Hello, " + customerName + ", your payment of $" + amountDue + " is outstanding" + " for " + paymentInfo +". It was due on " + paymentDueDate +"."+ " Please visit "+ paymentLink + " to pay your balance. If you have any questions, contact us at support@example.com. Thanks!",
       From: signalwirePhoneNumber,  // Your SignalWire phone number
     },
   });
   return 'sent: ' + new Date();
 } catch (err) {
   return 'error: ' + err;
 }
};

//Send SMS to all numbers on your sheet
function sendSmsToAll() {
var sheet = SpreadsheetApp.getActiveSheet();
var rows = sheet.getDataRange().getValues();
var headers = rows.shift();
rows.forEach(function(row) {row[MESSAGE_STATUS] =  sendSms(row[CUSTOMER_PHONE_NUMBER], row[AMOUNT_DUE], row[PAYMENT_LINK], row[CUSTOMER_NAME],row[PAYMENT_INFO], row[PAYMENT_DUE_DATE]);
 });
  sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
};

//Send SMS by date range 
function sendSmsByDateFilter() {
 var sheet = SpreadsheetApp.getActiveSheet();
 var rows = sheet.getDataRange().getValues();
 var headers = rows.shift();
 
rows.forEach(function(row) {
   var dueDate = new Date(row[PAYMENT_DUE_DATE]);
   var dateFormat = Utilities.formatDate(dueDate, "GMT-7", "MM/dd/yyyy")
   var dayDue = dateFormat.substring(3,5)
   
   if (dayDue >= 1 && dayDue <= 15) { // Change the date range if desired
     row[MESSAGE_STATUS] = sendSms(row[CUSTOMER_PHONE_NUMBER], row[AMOUNT_DUE], row[PAYMENT_LINK], row[CUSTOMER_NAME],row[PAYMENT_INFO], row[PAYMENT_DUE_DATE]);
   }
 });
  sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
};
