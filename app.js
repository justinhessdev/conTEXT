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
        {id: 1, user_id: 1, body: "Haro Word"},
        {id: 2, user_id: 1, body: "How are you?"},
        {id: 3, user_id: 2, body: "I'm great! Thanks for asking"}
      ]
    }
  },
  // .map will return new array based on original one, formated how we choose

  createMessage: function(body) {
    this.setState({
      isLoggedIn: false,
      messages: [
        ...this.state.messages,
        {id: this.state.messages.length + 1, user_id:1, body: body}
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
        <MessageList messages={this.state.messages} />
        <MessageForm onSubmit={this.createMessage}/>
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
      if(m.user_id == '1') {
        return (
          <div key={m.id} className="clearfix">
            <p key={m.id} className="pull-left">{m.body}</p>
          </div>
        )
      } else {
        return (
          <div key={m.id} className="clearfix">
            <p key={m.id} className="pull-right">{m.body}</p>
          </div>
        )
      }
    })
    const divStyle = {
      background: 'blue',
      color: 'white'
    }

    return (
    <div className="row">
      <div className="col-md-4 col-md-offset-1 ">
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

// when i say onSubmit we want to prevent refresh of page from form
// we can use the event from the form onsubmit to prevent default behavior
  render: function() {
    return (
      <div id='message-form'>
        <br></br>

        <form onSubmit={this.handleSubmit}>
          <div className="col-md-4 col-md-offset-1">
            <label className="sr-only" htmlFor="ex3">col-xs-4</label>
            <input className="form-control" id="ex3" type='text' ref='newMessage'/>
          </div>

          <button className="btn btn-primary" onClick={this.handleSubmit}>Submit</button>
        </form>


      </div>
    )
  }
})

//react-dom helps us render / append to front end / DOM
// takes two args -- 1. what to render 2. where to render
ReactDOM.render(<Dashboard />, document.getElementById('main'))
