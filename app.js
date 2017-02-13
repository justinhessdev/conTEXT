// instantiate component and what we put in contains all its properties
// a compnent in react must be able to get rendered / be visible
// every component in react has a keyword render -- react looks for it
//get intital state is not required by every component but it returns our state object which contains an array of messages
// a data representatino of what will appear in the front end
// now we can call this.state to access messages in getInitialState
// take array and map it to something renerable - like MessageForm component
// Dashboard won't 'render' until 'getInitialState' is complete ---- lifecycle
// setState is accesible by all componenets

const Dashboard = React.createClass({
  getInitialState: function() {
    return {
      isLoggedIn: true,
      messages: [
        {id: 1, user_id: 1, body: "Hey there", urgent: 0, context: ''},
        {id: 2, user_id: 1, body: "How are you?", urgent: 0, context: ''},
        {id: 3, user_id: 2, body: "I'm great! Thanks for asking", urgent: 0, context: ''},
        {id: 4, user_id: 1, body: "😍", urgent: 0, context: ''}
      ]
    }
  },
  // .map will return new array based on original one, formated how we choose

  createMessage: function(body) {
    this.setState({
      isLoggedIn: false,
      messages: [
        ...this.state.messages,
        {id: this.state.messages.length + 1, user_id:1, body: body, urgent: 0, context: ''}
      ]
    })
  },

  lockForm: function() {
    this.setState({
      isLoggedIn: false
    })
  },

  render: function() {
    if(this.state.isLoggedIn) { setTimeout(this.lockForm, 5000) }
    return (
      <div id="dashboard">
        <MessageList messages={this.state.messages}/>
        <MessageForm onSubmit={this.createMessage}/>
        <CtxForm onSubmit={this.createMessage}/>
      </div>
    )
  }
})

// props: we pass down properties to child components and unchangeable
// based on same data store
// props are declared as attributes on our <MessageList tag
// this is stateless component
// extremely powerful when we want to create plug and play stuff
const MessageList = React.createClass({
  render: function() {
    const messages = this.props.messages.map((m) => {
      if(m.user_id == '2') {
        return (
          <div key={m.id} className="clearfix">
            <p key={m.id} className="bubble">{m.body}</p>
          </div>
        )
      } else {
        return (
          <div key={m.id} className="clearfix">
            <p key={m.id} className="bubble bubble--alt">{m.body}</p>
          </div>
        )
      }
    })
    const divStyle = {
      border: "1px dotted black",
      marginTop: '5px',
      padding: '10px'
    }

    return (
    <div className="row">
      <div className="col-md-6 col-md-offset-1 ">
        <div style={divStyle} id="message-list">
          <br></br>
          {messages}
        </div>
      </div>
    </div>
    )
  }
})

// handlesubmit
// we use ref on input field to get value
// also stateless -- powerful -- plug and play
// this.props.onSubmit we go back up to dashboard onSubmit props which calls dsahboard handleSubmit method
const MessageForm = React.createClass({
  handleSubmit: function(evt) {
    evt.preventDefault()
    this.props.onSubmit(this.refs.newMessage.value)
    this.refs.newMessage.value = ''
  },

  showContextModal: function() {
     $('#ctx-form').show()
     $('#message-form').hide()
  },

  modalSubmit: function(message) {
    this.props.onSubmit(message)

  },

// when i say onSubmit we want to prevent refresh of page from form
// we can use the event from the form onsubmit to prevent default behavior
  render: function() {
    return (
      <div id='message-form'>
        <br></br>

        <form onSubmit={this.handleSubmit}>
          <div className="col-md-6 col-md-offset-1">
            <label className="sr-only" htmlFor="ex3">send message</label>
            <div className="input-group">
              <input className="form-control" id="ex3" type='text' ref='newMessage' placeholder="send message - press enter"/>
              <div className="input-group-addon" onClick={this.showContextModal}>conTEXT</div>
            </div>
          </div>
          <button className="btn btn-primary sr-only" onClick={this.handleSubmit}>Submit</button>
        </form>
      </div>
    )
  }
})

const CtxForm = React.createClass({

  getInitialState: function() {
    return {
      value: 'blank'
    }
  },

  handleSubmit: function(evt) {
    evt.preventDefault()
    this.props.onSubmit(this.refs.ctxMessage.value)
    this.refs.ctxMessage.value = ''
    $('#ctxBorder').removeClass('red')
    $('#ctx-form').hide()
    $('#message-form').show()
  },

  // change state of select options
  handleChange: function(event) {
    this.setState({value: event.target.value});
  },

  // handel when user clicks close.. hide context form and show original input form
  handleClose: function(event) {
    $('#ctx-form').hide()
    $('#ctxBorder').removeClass('red')
    $('#message-form').show()
  },

  handleUrgent: function() {
    $('#ctxBorder').toggleClass('red')
  },

  // when i say onSubmit we want to prevent refresh of page from form
  // we can use the event from the form onsubmit to prevent default behavior
  render: function() {
    return (
      <div id='ctx-form'>
        <form onSubmit={this.handleSubmit}>
          <div className="col-md-6 col-md-offset-1">
            <div className="form-group">
              <div id="ctxBorder">
                <p>What do you want to talk about?</p>
                <textarea className="form-control"  id="ctx-area" ref='ctxMessage' rows="2"></textarea>
                <br></br>
                <label htmlFor="more">Add more context</label>
                <select id="ctxSelect" value={this.state.value} onChange={this.handleChange}>
                  <option value="blank">Add more context</option>
                  <option value="time">Time</option>
                  <option value="location">Location</option>
                  <option value="reminder">Set a reminder</option>
                </select>
                <br></br>
                <label htmlFor="urgent">Make it urgent</label>
                <button id="urgentButton" type="button" className="btn btn-default" onClick={this.handleUrgent}>Urgent</button>
                <button type="button" className="btn btn-default pull-right" onClick={this.handleClose}>Close</button>
                <button id="sendContextButton" type="button" className="btn btn-primary pull-right" onClick={this.handleSubmit}>Send</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
})

//react-dom helps us render / append to front end / DOM
// takes two args -- 1. what to render 2. where to render
ReactDOM.render(<Dashboard />, document.getElementById('main'))
