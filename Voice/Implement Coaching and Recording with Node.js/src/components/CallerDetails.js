import React, { Component } from 'react';

export class CallerDetails extends Component {
    static displayName = CallerDetails.name;

    constructor(props) {
        super(props);
        this.state = { data: [], loading: true, conferenceId: props.conferenceId, participantId: props.participantId };

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
        }, 2000);
    }

    static renderCallerDetails(info) {

        function callerInfo(data){

            if(data.isSupervisor){
                return (
                    <div>
                        <strong>Supervisor - {data.number}</strong>
                    </div>    
                )
            }else if(data.isAgent){
                return (
                    <div>
                        <strong>Agent - {data.number}</strong>
                    </div>    
                )
            }else if(data.isCustomer){
                return (
                    <div>
                        <strong>Customer - {data.number}</strong>
                    </div>    
                )
            }
        }
        return (
           <div>
            {
             callerInfo(info)   
            }
          </div>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : CallerDetails.renderCallerDetails(this.state.data);

        return (
            <div>
                {contents}
            </div>
        );
    }
}