import React, { Component } from 'react';
import PropTypes from 'proptypes';
import classnames from 'classnames';
import _ from 'lodash';
import  endcall  from './app.js'; 

 var endTime = new Date().setTime(1362009600000);
var currentTime = new Date().getTime();
var remainingTime = endTime - currentTime;
//var mins = 5;
var mins = Math.floor((remainingTime/1000)/60);
// calculate the seconds (don't change this! unless time progresses at a different speed for you...)
//var secs = mins * 60;
var secs = Math.floor(remainingTime/1000);
//var recorder = new RecordRTC_Extension(); 
var blobs = [];
var recorder;
 var pg ;



class CallWindow extends Component {
  constructor(props) {
     
    super(props);
    this.state = {
      Video: true,
      Audio: true
    };

    this.btns = [
      { type: 'Video', icon: 'fa-video-camera' },
      { type: 'Audio', icon: 'fa-microphone' }
    ];
    
   

    
    
    
    
  }

  componentDidMount() {
    this.setMediaStream();
    
   
    
    
    
    
  }

  componentWillReceiveProps(nextProps) {
    const { config: currentConfig } = this.props;
    // Initialize when the call started
    if (!currentConfig && nextProps.config) {
      
      const { config, mediaDevice } = nextProps;
      _.forEach(config, (conf, type) => mediaDevice.toggle(_.capitalize(type), conf));

      this.setState({
        Video: config.video,
        Audio: config.audio
      });
    }
    
    
    
  }
  
  database() {
  
 
 console.log('inside');
/*app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM user', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
});*/
 

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

client.query('SELECT * FROM user;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});
  
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
           window.location.replace("https://saasnicwebrtc.herokuapp.com/");
        }else{console.log('Tgggggggggggggggggggggggggggggggggggg');}
    }, 1000);
}

  abc(){
    
    document.getElementById("myBtn").disabled = true;
    var fiveMinutes = 60 * 5,
        display = document.querySelector('#time');
    this.startTimer(fiveMinutes, display);
}
btnstartrecording() {  
  
 if(typeof RecordRTC_Extension === 'undefined') {
  
   if (window.confirm('To enable recording please download the extension by clicking OK')) 
{
window.open(
  'https://chrome.google.com/webstore/detail/recordrtc/ndcljioonkecdnaaihodjgiliohngojp?hl=en',
  '_blank' // <- This is what makes it open in a new window.
);recorder = new RecordRTC_Extension(); 
};
   
}

 recorder = new RecordRTC_Extension();   
document.getElementById("myBtn").disabled = false;
    //var video = document.querySelector('video');
    this.disabled = true;
    // you can find list-of-options here:
    // https://github.com/muaz-khan/Chrome-Extensions/tree/master/screen-recording#getsupoortedformats
    var options = recorder.getSupoortedFormats()[3];
    recorder.startRecording(options, function() {
        document.getElementById('btn-stop-recording').disabled = false;
    });
}   
 stopRecordingCallback(blob) {
    
    var video = document.querySelector('video');
    
    video.src = video.srcObject = null;
   var blob = new File(blobs, 'video.mp4', {
        type: 'video/mp4'
    });
    //video.src = URL.createObjectURL(blob);
    
    recorder = null;
}  
 btnstoprecording(){
  
  //this.disabled = true;

    // third and last step
   var options = recorder.getSupoortedFormats()[3];
    recorder.stopRecording(this.stopRecordingCallback());
   const { peerSrc, localSrc } = this.props;
   this.peerVideo.srcObject = peerSrc; 
} 

  
  componentDidUpdate() {
    this.setMediaStream();
  }

  setMediaStream() {
    const { peerSrc, localSrc } = this.props;
    if (this.peerVideo && peerSrc) {this.abc();this.peerVideo.srcObject = peerSrc;}
    if (this.localVideo && localSrc) this.localVideo.srcObject = localSrc;
  }

  /**
   * Turn on/off a media device
   * @param {String} deviceType - Type of the device eg: Video, Audio
   */
  toggleMediaDevice(deviceType) {
    const { mediaDevice } = this.props;
    const deviceState = _.get(this.state, deviceType);
    this.setState({ [deviceType]: !deviceState });
    mediaDevice.toggle(deviceType);
  }

  renderControlButtons() {
    const getClass = (icon, type) => classnames(`btn-action fa ${icon}`, {
      disable: !_.get(this.state, type)
    });

    return this.btns.map(btn => (
      <button
        key={`btn${btn.type}`}
        type="button"
        className={getClass(btn.icon, btn.type)}
        onClick={() => this.toggleMediaDevice(btn.type)}
      />
    ));
  }

  render() {
    const { status, endCall } = this.props;
    return (
      <div className={classnames('call-window', status)}>
      
      
        <video id="peerVideo" ref={el => this.peerVideo = el} autoPlay />
        <video id="localVideo" ref={el => this.localVideo = el} autoPlay muted />
        <div className="video-control">
<div id="timer">

<span id="time"></span>
</div>
{this.renderControlButtons()}

          <button
            type="button"
            className="btn-action hangup fa fa-phone"
            onClick={() => endCall(true)}
          />

    
      <button
            type="button"
            Style="content: '';background-color: green;border-color: white;border-radius: 50%;border-width: 5px;height: 40px; width: 40px;"
            onClick={() => this.btnstartrecording()}
          />
        <button
            type="button"
            id="myBtn"
            Style="content: '';background-color: red;border-color: white;border-radius: 50%;border-width: 5px;height: 40px; width: 40px;"
            onClick={() => this.btnstoprecording()}
          />
        <button
            type="button"
            className="btn-action hangup fa fa-phone"
            onClick={() => this.database()}
          />
        </div>
      </div>
    );
  }
}


CallWindow.propTypes = {
  status: PropTypes.string.isRequired,
  localSrc: PropTypes.object, // eslint-disable-line
  peerSrc: PropTypes.object, // eslint-disable-line
  config: PropTypes.object, // eslint-disable-line
  mediaDevice: PropTypes.object, // eslint-disable-line
  endCall: PropTypes.func.isRequired
};

export default CallWindow;
