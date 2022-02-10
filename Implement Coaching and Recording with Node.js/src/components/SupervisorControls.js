import React, { Component } from 'react';

export class SupervisorControls extends Component {
    static displayName = SupervisorControls.name;

    constructor(props) {
        super(props);
        this.state = { data: [], loading: true, conferenceId: props.conferenceId, participantId: props.participantId, participantCoaching: props.participantCoaching, participantMuted: props.participantMuted, participantCallSidToCoach: props.participantCallSidToCoach };

        fetch("/api/helpers/lookupCaller?callSid=" + this.props.participantId)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.setState({ data: data, loading: false });
            });
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            fetch("/api/helpers/lookupCaller?callSid=" + this.props.participantId)
                .then(response => response.json())
                .then(data => {
                    this.setState({ data: data, loading: false });
                });
        }, 3000);
    }

    updateConference(conferenceId, participantId, cmd, coachSid)  {
        fetch("/api/conferences/update?conferenceId=" + conferenceId + "&participantId=" + participantId + "&cmd=" + cmd + "&coachSid=" + coachSid)
         .then(function(response) {
            console.log("response: ", response)

            var data  = response.json();

            console.log('-- update ' + cmd + ' data start --')     
            console.log(data);
            var coaching = data.coaching;
            var muted = data.muted;
            this.setState({  participantCoaching: coaching, participantMuted: muted });
            
            this.forceUpdate();

            console.log('-- update ' + cmd + ' data complete --')     

         }.bind(this)).catch(function(e) {
            console.log("error" + e);
         });
    }   

    renderSupervisorControls(data, conferenceId, participantId) {

        if(data.isSupervisor){
            console.log(data);
            
            if(this.state.participantCoaching && this.state.participantMuted){ // Monitor
                return (
                    <div>
                        <strong>Supervisor Controls:</strong>
                        <span onClick={()=>{this.updateConference(conferenceId, participantId, "barge", "")}}>[Barge]</span> 
                        <span onClick={()=>{this.updateConference(conferenceId, participantId, "monitor", "")}}><strong>[Monitor]</strong></span> 
                        <span onClick={()=>{this.updateConference(conferenceId, participantId, "coach", this.state.participantCallSidToCoach)}}>[Coach]</span>
                    </div>    
                )
            }else if(!this.state.participantCoaching && !this.state.participantMuted){
                return (
                    <div>
                        <strong>Supervisor Controls:</strong>
                        <span onClick={()=>{this.updateConference(conferenceId, participantId, "barge", "")}}><strong>[Barge]</strong></span> &nbsp;&nbsp;&nbsp;
                        <span onClick={()=>{this.updateConference(conferenceId, participantId, "monitor", "")}}>[Monitor]</span> &nbsp;&nbsp;&nbsp;
                        <span onClick={()=>{this.updateConference(conferenceId, participantId, "coach", this.state.participantCallSidToCoach)}}>[Coach]</span>
                    </div>    
                )
            }else if(this.state.participantCoaching && !this.state.participantMuted){
                return (
                    <div>
                        <strong>Supervisor Controls:</strong>
                        <span onClick={()=>{this.updateConference(conferenceId, participantId, "barge", "")}}>[Barge]</span> &nbsp;&nbsp;&nbsp;
                        <span onClick={()=>{this.updateConference(conferenceId, participantId, "monitor", "")}}>[Monitor]</span> &nbsp;&nbsp;&nbsp;
                        <span onClick={()=>{this.updateConference(conferenceId, participantId, "coach", this.state.participantCallSidToCoach)}}><strong>[Coach]</strong></span>
                    </div>    
                )
            }else if(!this.state.participantCoaching && this.state.participantMuted){
                return (
                    <div>
                        <strong>Supervisor Controls:</strong>
                        <span onClick={()=>{this.updateConference(conferenceId, participantId, "barge", "")}}>[Barge]</span> &nbsp;&nbsp;&nbsp;
                        <span onClick={()=>{this.updateConference(conferenceId, participantId, "monitor", "")}}>[Monitor]</span> &nbsp;&nbsp;&nbsp;
                        <span onClick={()=>{this.updateConference(conferenceId, participantId, "coach", this.state.participantCallSidToCoach)}}>[Coach]</span>
                    </div>    
                )
            }

        }
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderSupervisorControls(this.state.data,  this.state.conferenceId, this.state.participantId);

        return (
            <div>
                {contents}
            </div>
        );
    }
}