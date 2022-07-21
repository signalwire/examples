import React, { Component } from 'react';
//import { ConferenceRecordings } from './ConferenceRecordings';
import { Participants } from './Participants';

export class Dashboard extends Component {
    static displayName = Dashboard.name;

    constructor(props) {
        super(props);
        this.state = { realtimedata: [], loading: true };

        fetch('api/Dashboard')
            .then(response => response.json())
            .then(data => {
                this.setState({ realtimedata: data, loading: false });
            });
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            fetch('api/Dashboard')
                .then(response => response.json())
                .then(data => {
                    this.setState({ realtimedata: data, loading: false });
                });
        }, 2000);
    }

    static renderDashboard(info) {
        return (
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>Active Conferences</th>
                    </tr>
                </thead>
                <tbody>
                    {info.conferences.filter(filter=>filter.status != "completed").map(conf =>
                        <tr key={conf.sid}>
                            <td>
                                {conf.friendly_name} - ({conf.status})                   
                                <p>
                                    <div>{/*<ConferenceRecordings conferenceId={conf.sid} participantId="" />*/}</div>
                                </p>
                                <br />
                                <p>
                                    <div><Participants conferenceId={conf.sid} /></div>
                               </p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : Dashboard.renderDashboard(this.state.realtimedata);

        return (
            <div>
                <h1>Dashboard</h1>
                {contents}
            </div>
        );
    }
}