import React, { Component } from 'react';
import PropTypes from 'proptypes';


let friendID;

class MainWindow extends Component {
  /**
   * Start the call with or without video
   * @param {Boolean} video
   */
  callWithVideo(video) {
    const { startCall } = this.props;
    const config = { audio: true, video};
    return () => startCall(true, friendID, config);
  }
  callWithVideo12(video) {
    const { startCall12 } = this.props;
    const config = { audio: true, video: false};
    return () => startCall12(true, friendID, config);
  }
  
  database() {
  
  var connectionString = "postgres://bzshbrrnoxietj:46501dac4a137a60da10a1de5fd5741ddc665c4337c36ea5007458c5c46dc1bf@ec2-174-129-194-188.compute-1.amazonaws.com:5432/d3cld8si9il4oe"

pg.connect(connectionString, function(err, client, done) {
   client.query('SELECT * FROM your_table', function(err, result) {
      done();
      if(err) return console.error(err);
      console.log(result.rows);
   });
});
  }
 
  
  render() {
    const { clientId } = this.props;
    console.log(`${clientId}`);
    document.title = `${clientId} - VideoCall`;
    return (
      <div className="container main-window">
        <div>
          <h3>
            Hi, your ID is
            <input
              type="text"
              className="txt-clientId"
              defaultValue={clientId}
              readOnly
            />
          </h3>
          <h4>Get started by calling a friend below</h4>
        </div>
        <div>
          <input
            type="text"
            className="txt-clientId"
            spellCheck={false}
            placeholder="Your friend ID"
            onChange={event => friendID = event.target.value}
          />
           
          <div>
      
            <button
              type="button"
              className="btn-action fa fa-video-camera"
              onClick={this.callWithVideo(true)}
            />
            <button
              type="button"
              className="btn-action fa fa-phone"
              onClick={this.callWithVideo12(false)}
            />
              <button
              type="button"
              className="btn-action fa fa-video-camera"
              onClick={this.database(true)}
            /> 
          </div>
        </div>
      </div>
    );
  }
}

MainWindow.propTypes = {
  clientId: PropTypes.string.isRequired,
  startCall: PropTypes.func.isRequired,
  startCall12: PropTypes.func.isRequired
};

export default MainWindow;
