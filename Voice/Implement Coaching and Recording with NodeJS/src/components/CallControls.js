import React, { Component } from 'react';
import { Modal, Tab, Nav, Col, Row, FormControl, InputGroup, Button, Spinner, Accordion, Card } from 'react-bootstrap';


export class CallControls extends Component {
    static displayName = CallControls.name;

    constructor(props) {
        super(props);
        this.state = { loading: true, expanded: false, resultsReady: false, row: props.row, callLegs: props.callLegs };
        console.log('-- states --')
        console.log(this.state);
    }

    componentDidMount() {
        this.populateRelatedCalls();
    }

    renderContents() {

        return (
            this.state.row
                .filter(filter =>

                    filter.field == "fs.to"
                    || filter.field == "message"
                    || filter.field == "fs.disposition"
                    || filter.field == "fs.duration"
                    || filter.field == "fs.from"
                    || filter.field == "fs.direction"
                    || filter.field == "@timestamp"
                    || filter.field == "fs.call_id"
                    || filter.field == "fs.sip_call_id"
                    || filter.field == "fs.segment_id"
                    || filter.field == "fs.hangup_cause"
                    || filter.field == "fs.audio_in_mos"
                )
                .map(field =>
                    this.renderRow(field)
                )
        )
    }

    renderRow(value) {

        function parseMessage(message, extract) {
            if (message.includes(extract)) {
                console.log("-- found extract 1 --")
                var parts = message.split("\n");
                for (var i = 0; i < parts.length; i++) {
                    if (parts[i].includes(extract)) {
                        var part = parts[i].replace(extract, "");
                        part = part.trim();
                        return part;
                        //alert(part);
                    }
                }
            }
            console.log('-- no found extract --')
            return "";
        }

        function parseMessageBool(message, extract, match) {
            var parts = message.split("\n");
            for (var i = 0; i < parts.length; i++) {
                if (parts[i].includes(extract)) {
                    var part = parts[i].replace(extract, "");
                    part = part.trim();
                    if (part == match) {
                        return true;
                    }
                }
            }
            return false;
        }

        //console.log("--- render Row ---");
        //console.log(field);
        if (value.field == "fs.sip_call_id" || value.field == "fs.segment_id") {
            return;
        } else if (value.field == "message") {
            return;
        } else if (value.field == "fs.call_id") {
            // X-CID: 438576636_66976462@192.168.18.40

            var message = this.state.row.filter(row => row.field == "message");
            //console.log(message)
            var theXcId = parseMessage(message, "X-CID");
            //console.log('-- EXTRACTED X-CID ---');
            //console.log(theXcId);

            var theSipId = this.state.row.filter(row => row.field == "fs.sip_call_id");
            console.log('-- EXTRACTED SIP ID ---');

            if (theSipId.length > 0) {
                theSipId = theSipId[0].value;
            } else {
                theSipId = "";
            }

            return (
                <div style={{ display: 'inline-block', width: '130px', border: '0px solid black', verticalAlign: 'top', overflowWrap: 'break-word' }}>
                    <div style={{ width: "125px" }}>
                        <Button variant="primary" onClick={() => this.props.setState({ showSnoop: true, showSipData: false, showKamailioLogs: true, showFreeswitchLogs: true, showPrimeRailsLogs: true, showMetaData: false }, async () => { this.props.showModal(true, value.value, theSipId, this.state.row) })}>
                            Logs
                </Button> &nbsp;
                    <Button variant="primary" onClick={() => this.props.setState({ showSnoop: true, showSipData: true, showKamailioLogs: true, showFreeswitchLogs: true, showPrimeRailsLogs: false, showMetaData: true }, async () => { this.props.showModal(true, value.value, theSipId, this.state.row) })}>
                            SIP
                </Button>

                    </div>
                </div>
            )
        } else if (value.field == "@timestamp") {
            var date = new Date(Date.parse(value.value));

            var dateStr =
                date.getFullYear() + "-" + ("00" + (date.getMonth() + 1)).slice(-2) + "-" + ("00" + date.getDate()).slice(-2) + " " +
                ("00" + date.getUTCHours()).slice(-2) + ":" +
                ("00" + date.getUTCMinutes()).slice(-2) + ":" +
                ("00" + date.getUTCSeconds()).slice(-2) +
                "." + ('00' + date.getUTCMilliseconds()).slice(-3) + "Z";
            return (
                <div style={{ display: 'inline-block', width: '120px', paddingLeft: '0px', border: '0px solid black', verticalAlign: 'top', overflowWrap: 'break-word' }}>
                    {dateStr}
                </div>
            )
        } else {
            return (
                <div style={{ display: 'inline-block', width: '120px', paddingLeft: '0px', border: '0px solid black', verticalAlign: 'top', overflowWrap: 'break-word' }}>
                    {decodeURIComponent(value.value.replace('_', ' ').replace('_', ' '))}
                </div>
            )
        }
    }



    render() {
        let contents = this.state.loading
            ? <Spinner animation="border" />
            : this.renderContents();

        return (
            <div>
                {contents}
            </div>
        );
    }

    async populateRelatedCalls() {
        //const response = await fetch('weatherforecast');
        //const data = await response.json();
        //setTimeout(this.setState, 1400, { loading: false });
        // this.setState({ loading: false })
        setTimeout(() => {
            this.setState(state => ({
                loading: false
            }));
        }, 800)
    }
}
