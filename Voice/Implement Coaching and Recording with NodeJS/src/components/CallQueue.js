import React, { Component } from 'react';
import { Modal, Tab, Nav, Col, Row, FormControl, InputGroup, Button, Spinner, Accordion, Card } from 'react-bootstrap';
import { CallControls } from './CallControls';


export class CallQueue extends Component {
    static displayName = CallQueue.name;

    constructor(props) {
        super(props);
        this.state = { 
            loading: false, 
            expanded: false, 
            resultsReady: false, 
            parentCallId: '',
            parentSipId: '',
            row: props.row, 
            callLegs: props.callLegs, 
            trace: [],
            startDate: new Date(Date.now() - 604800000),
            endDate: new Date()
        };
        console.log('-- states --')
        console.log(this.state);
    }

    componentDidMount() {
        //this.populateRelatedCalls();

    }

    renderRelatedCalls() {

        function renderRelatedCallsContent(ready, data, props, callLegs, parentCallId) {
            if (ready) {
                /* return <div style={{backgroundColor: '#fbe6af'}}>
<ElkTraceResult
                                        row={props.row}
                                        showModal={props.showModal.bind(this)}
                                        setState={props.setState.bind(this)} 
                                    />
                        </div>*/

if(callLegs.length>0){
return (
                    <div>
                        {
                            callLegs.map(leg =>
                                <div>
                <div style={{ display: 'inline-block', width: '130px', border: '0px solid black', verticalAlign: 'top', overflowWrap: 'break-word' }}>
                    <div style={{ width: "125px", display: 'inline-block' }}>
                        <Button variant="primary" onClick={() => props.setState({ showSnoop: true, showSipData: false, showKamailioLogs: true, showFreeswitchLogs: true, showPrimeRailsLogs: true, showMetaData: false }, async () => { props.showModal(true, parentCallId, leg, props.row) })}>
                            Logs
                </Button> &nbsp;
                    <Button variant="primary" onClick={() => props.setState({ showSnoop: true, showSipData: true, showKamailioLogs: true, showFreeswitchLogs: true, showPrimeRailsLogs: false, showMetaData: true }, async () => { props.showModal(true, parentCallId, leg, props.row) })}>
                            SIP
                </Button>

                    </div>
                </div>
                                    {leg}
                                </div>
                            )}
                    </div>
                )
}else{
    return <p>No other legs found.</p>
}
                console.log('call legs here')
                console.log(callLegs)
        

            } else {
                return <div><Spinner animation="border" /></div>
            }
        }

        var contents = 'blah blah blah';

        if (this.state.expanded) {

            return <div>
                <strong>Related Calls: </strong>
                {renderRelatedCallsContent(true, contents, this.props, this.state.callLegs, this.state.parentCallId)}
            </div>

        } else {
            return <div><strong onClick={() => {
                this.setState({ expanded: true }); this.populateRelatedCalls();
            }}>[+] Show Related Calls</strong></div >
        }
    }



    render() {
        let contents = this.state.loading
            ? <Spinner animation="border" />
            : this.renderRelatedCalls();

        return (
            <div>
                {contents}
            </div>
        );
    }

 scanForXcId() {

        function parseMessage(message, extract) {
            if (message) {
                if (message.includes(extract)) {
                    console.log("-- found extract 2 --")
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
            }
            return "";
        }

            console.log("--- scanForXcId2(trace) ---");
            if (typeof this.state.trace !== 'undefined' && this.state.trace.length > 1) {

                //console.log(props);
                let callLegs = [...this.state.callLegs];

                for (var i = 0; i < this.state.trace.length; i++) {
                    var xCid = parseMessage(this.state.trace[i].columns[2].message[0].value, "X-CID: ");

                    console.log(xCid)
                    if (xCid.length > 0) {
                        if (!callLegs.includes(xCid)) {
                            callLegs.push(xCid);
                            
                            console.log("adding call leg")
                            this.setState({ callLegs: callLegs })
                            console.log("call legs");
                            console.log(callLegs);
                        }
                    }                
                }
            } else {
                return ""
            }
    }


    async populateRelatedCalls() {

        var theCallId = this.state.row.filter(row => row.field == "fs.call_id");
        console.log('-- EXTRACTED Call ID ---');
        if (theCallId.length > 0) {
            theCallId = theCallId[0].value;
        } else {
            theCallId = "";
        }
        console.log(theCallId);
        var theSipId = this.state.row.filter(row => row.field == "fs.sip_call_id");
        console.log('-- EXTRACTED SIP ID ---');
        if (theSipId.length > 0) {
            theSipId = theSipId[0].value;
        } else {
             theSipId = "";
        }
        console.log(theSipId);

        this.setState({ loading: true, parentCallId: theCallId, parentSipId: theSipId }, async () => {

            let trace = [...this.state.trace];
           
            const response = await fetch("ping", {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
                }),
                body: "queryType=trace-related&callId=" + this.state.parentCallId + "&sipId=" + this.state.parentSipId + "&startDate=" + this.state.startDate.getTime() + "&endDate=" + this.state.endDate.getTime() + "&spaceId=value2&projectId=&to=&from=&sipAddress=&failuresOnly=&faxId=" // <-- Post parameters
            })
                .then((response) => response.text())
                .then(async (responseText) => {
                    const data = JSON.parse(responseText);
                    console.log("-- trace --")
                    this.setState({ trace: data.data.entries }, () => {
              
                        this.scanForXcId();

                        console.log(data.data.entries)

                        this.setState({ loading: false }, () => {
                            // show results
                        })
                    })
                })
                .catch((error) => {
                    alert(error)
                    console.error(error);
                });
        })
    }

    

}
