import React, { Component } from 'react';
import imgPlay from './media-play-2x.png'
import imgStop from './media-stop-2x.png'
import imgPause from './media-pause-2x.png'
import imgRecord from './media-record-2x.png'
import imgDelete from './delete-6x.png'

export class CallRecordings extends Component {
    static displayName = CallRecordings.name;

    constructor(props) {
        super(props);
        this.state = { data: [], loading: true, conferenceId: props.conferenceId, participantId: props.participantId };

        fetch('api/recordings/list?conferenceId=' + this.props.conferenceId + '&participantId=' + this.props.participantId)
            .then(response => response.json())
            .then(data => {
                this.setState({ data: data, loading: false });
            });
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            fetch('api/recordings/list?conferenceId=' + this.props.conferenceId + '&participantId=' + this.props.participantId)
                .then(response => response.json())
                .then(data => {
                    this.setState({ data: data, loading: false });
                });
        }, 2000);
    }

    static renderRecordings(info) {
    
        function startRecording(participantId, conferenceId, recordingSid)  {
            fetch("/api/recordings/start?conferenceId=" + conferenceId + "&participantId=" + participantId + "&recordingSid=" + recordingSid)
             .then(function(response) {
                console.log("response: ", response)
             }).catch(function() {
                console.log("error");
             });
        }
        
        function stopRecording(participantId, conferenceId, recordingSid)  {
            fetch("/api/recordings/stop?conferenceId=" + conferenceId + "&participantId=" + participantId + "&recordingSid=" + recordingSid)
             .then(function(response) {
                console.log("response: ", response)
             }).catch(function() {
                console.log("error");
             });
        }
        
        function pauseRecording(participantId, conferenceId, recordingSid)  {
            fetch("/api/recordings/pause?conferenceId=" + conferenceId + "&participantId=" + participantId + "&recordingSid=" + recordingSid)
             .then(function(response) {
                console.log("response: ", response)
             }).catch(function() {
                console.log("error");
             });
        }

        function playRecording(participantId, conferenceId, recordingSid)  {
            fetch("/api/recordings/pause?conferenceId=" + conferenceId + "&participantId=" + participantId + "&recordingSid=" + recordingSid)
             .then(function(response) {
                console.log("response: ", response)
             }).catch(function() {
                console.log("error");
             });
        }
    
        function renderControls(recording){
            
            if(recording.status==="completed"){
                return (
                    <div>
                        <img onClick={()=>playRecording(recording.call_sid,recording.conference_sid,recording.sid)} src={imgPlay} alt="Play" />
                   </div>     
                )
            }else if(recording.status==="in-progress"){
                return (
                    <div>
                        <img onClick={()=>stopRecording(recording.call_sid,recording.conference_sid,recording.sid)} src={imgStop} alt="Stop" />
                        <img onClick={()=>pauseRecording(recording.call_sid,recording.conference_sid,recording.sid)} src={imgPause} alt="Pause" />
                    </div>     
                )
            }else if(recording.status==="paused"){
                return (
                    <div>
                        <img onClick={()=>startRecording(recording.call_sid,recording.conference_sid,recording.sid)} src={imgRecord} alt="Record" />
                    </div>     
                )
            }else if(recording.status==="stopped"){
                return (
                    <div>
                        <img onClick={()=>playRecording(recording.call_sid,recording.conference_sid,recording.sid)} src={imgPlay} alt="Play" />
                        <img onClick={()=>startRecording(recording.call_sid,recording.conference_sid,recording.sid)} src={imgRecord} alt="Record" />
                   </div>     
                )
            }       
        }
        return (
            <div>
            {
                info.recordings
                .map((recording) => { 
                    console.log(recording)
                    return (
                        <div>
                            <br />
                            <p>
                            <div>recording_sid: {recording.sid} </div>
                            <div>status: {recording.status} </div>

                            { renderControls(recording) }

                            </p>
                        </div>
                    )
                })
            }
          </div>
        );
    }

    startRecording = () => {
        fetch("/api/recordings/start?conferenceId=" + this.props.conferenceId + '&participantId=' + this.props.participantId)
         .then(function(response) {
            console.log("It worked, response is: ", response)
         }).catch(function() {
            console.log("error");
         });
    }

    
    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : CallRecordings.renderRecordings(this.state.data);

        return (
            <div>
                <strong>Recordings </strong> <span onClick={this.startRecording}><img src={imgRecord} alt="Record" /></span>
                {contents}
            </div>
        );
    }
}