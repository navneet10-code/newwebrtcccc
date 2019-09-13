import React, { Component } from 'react';
import { render } from 'react-dom';
import _ from 'lodash';
import socket from './socket';
import PeerConnection from './PeerConnection';
import MainWindow from './MainWindow';
import CallWindow from './CallWindow';
import CallModal from './CallModal';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: '',
      callWindow: '',
      callModal: '',
      callFrom: '',
      localSrc: null,
      peerSrc: null
    };
    this.pc = {};
    this.config = null;
    this.startCallHandler = this.startCall.bind(this);
    this.startCall12Handler = this.startCall12.bind(this);
    this.endCallHandler = this.endCall.bind(this);
    this.rejectCallHandler = this.rejectCall.bind(this);
  }

  componentDidMount() {
    socket
      .on('init', data => this.setState({ clientId: data.id }))
      .on('request', data => this.setState({ callModal: 'active', callFrom: data.from }))
      .on('call', (data) => {
        if (data.sdp) {
          this.pc.setRemoteDescription(data.sdp);
          if (data.sdp.type === 'offer') this.pc.createAnswer();
        } else this.pc.addIceCandidate(data.candidate);
      })
      .on('end', this.endCall.bind(this, false))
      .emit('init');
  }

  startCall(isCaller, friendID, config) {
    this.config = config;
    this.pc = new PeerConnection(friendID)
      .on('localStream', (src) => {
        const newState = { callWindow: 'active', localSrc: src };
        if (!isCaller) newState.callModal = '';
        this.setState(newState);
      })
      .on('peerStream', src => this.setState({ peerSrc: src }))
      .start(isCaller, config);
  }
  startCall12(isCaller, friendID, config) {
    console.log('i am in start call 12');
    this.config = config;
    console.log('i am in start call start');
    this.pc = new PeerConnection(friendID)
      .on('localStream', (src) => {
        const newState = { callWindow: 'active', localSrc: src };
        if (!isCaller) newState.callModal = '';
        this.setState(newState);
      })
      .on('peerStream', src => this.setState({ peerSrc: src }))
      .start12(isCaller, config);
    console.log('i am in start call last');
  }
  
  rejectCall() {
    
    const { callFrom } = this.state;
    console.log('llllllll',this.state);
    socket.emit('end', { to: callFrom });
    this.setState({ callModal: '' });
    
  }

endCall(isStarter) {
    if (_.isFunction(this.pc.stop)) this.pc.stop(isStarter);
    this.pc = {};
    this.config = null;
    this.setState({
      callWindow: '',
      localSrc: null,
      peerSrc: null
    });
  }
 
  database() {
  
  var pg = require('pg');
 console.log('inside');
app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM user', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
});
  
  
  }
  
  

  render() {
    const { clientId, callFrom, callModal, callWindow, localSrc, peerSrc } = this.state;
    return (
      <div>
        <MainWindow
          clientId={clientId}
          startCall={this.startCallHandler}
          startCall12={this.startCall12Handler}
        />
        <CallWindow
          status={callWindow}
          localSrc={localSrc}
          peerSrc={peerSrc}
          config={this.config}
          mediaDevice={this.pc.mediaDevice}
          endCall={this.endCallHandler}
        />
        <CallModal
          status={callModal}
          startCall={this.startCallHandler}
          startCall12={this.startCall12Handler}
          rejectCall={this.rejectCallHandler}
          callFrom={callFrom}
        />
      
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
