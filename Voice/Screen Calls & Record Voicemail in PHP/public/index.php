<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use SignalWire\LaML\VoiceResponse;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$app->post('/', function (Request $request, Response $response, $args) {
    $laml = new VoiceResponse;

    $dial = $laml->dial('', array('action' => '/voicemail', 'answerOnBridge' => true));
    // the below ENV variable should be replaced with a database lookup
    $dial->number(getenv('TO_NUMBER'), array('url' => '/screen'));

    $xmlResponse = $response->withHeader('Content-type', 'application/xml');
    $xmlResponse->getBody()->write(strval($laml));
    return $xmlResponse;
});

$app->post('/screen', function (Request $request, Response $response, $args) {
    $laml = new VoiceResponse;

    $post = $request->getParsedBody();

    $gather = $laml->gather(array(
    'action' => '/connect',
    'numDigits' => 1,
    'timeout' => 5
    ));

    $message = "You have a call from: {$post['From']}";
    $gather->say("{$message}. Press any digit to accept the call.");
    $laml->say('Hanging up');
    $laml->hangup();

    $xmlResponse = $response->withHeader('Content-type', 'application/xml');
    $xmlResponse->getBody()->write(strval($laml));
    return $xmlResponse;
});

$app->post('/connect', function (Request $request, Response $response, $args) {
    $laml = new VoiceResponse;

    $laml->say('Connecting you');

    $xmlResponse = $response->withHeader('Content-type', 'application/xml');
    $xmlResponse->getBody()->write(strval($laml));
    return $xmlResponse;
});

$app->post('/voicemail', function (Request $request, Response $response, $args) {
    $laml = new VoiceResponse;
    $post = $request->getParsedBody();

    if ($post['DialCallStatus'] != "completed") {
        $laml->say('Please leave a message after the beep. Press the pound key when done.');
        $laml->record(array(
            'action' => '/store',
            'maxLength' => 15,
            'finishOnKey' => '#'
        ));
    } else {
        $laml->hangup();
    }

    $xmlResponse = $response->withHeader('Content-type', 'application/xml');
    $xmlResponse->getBody()->write(strval($laml));
    return $xmlResponse;
});

$app->post('/store', function (Request $request, Response $response, $args) {
    $post = $request->getParsedBody();

    // do something with the recording
    // saveRecordingSomehow($post['RecordingUrl'], $post['From'], $post['To']);
    $response->getBody()->write('');
    return $response;
});

$app->run();