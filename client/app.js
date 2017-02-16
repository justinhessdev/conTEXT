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
        {id: 1, user_id: "58a39219fc4c98025a646ff1", body: "Hey there", context: false, urgent: false, customContext:""},
        {id: 2, user_id: "58a39219fc4c98025a646ff1", body: "How are you?", context: false, urgent: false, customContext:""},
        {id: 3, user_id: "58a3a774c8a707068b15dd1c", body: "I'm great! Thanks for asking", context: false, urgent: false, customContext:""},
        {id: 4, user_id: "58a39219fc4c98025a646ff1", body: "😍", context: false, urgent: false, customContext:""}
      ],
      conversations: []
    }
  },

  componentWillMount: function() {
      const sendSearch = fetch('/conversations', {credentials: 'same-origin'})
      var self = this

      function loadMyUsers(data) {
        data.json().then((jsonData) => {
          self.showConversationNames(jsonData)

        })
      }

      sendSearch.then(loadMyUsers)

  },

  // .map will return new array based on original one, formated how we choose

  createMessage: function(body, context, urgent, customContext) {
    this.setState({
      isLoggedIn: false,
      messages: [
        ...this.state.messages,
        {id: this.state.messages.length + 1, user_id: "58a39219fc4c98025a646ff1", body: body, urgent: 0, context: context, urgent: urgent, customContext: customContext}
      ]
    })
  },

  getDataFromConversation: function(messages, context, urgent, customContext) {
    var newMessages = []
    messages.map((message) => {
      newMessages.push({id: message._id, user_id:message._author._id, body: message.body, urgent: 0, context: context, urgent: urgent, customContext: customContext})

    })

    this.setState({
      messages: newMessages
    })
  },

  showConversationNames: function(names) {
    var conversationNames = []
    names.map((n) => {
      conversationNames.push({id: n._id, user2: n.user2})
    })

    this.setState({
      conversations: conversationNames
    })
  },

  lockForm: function() {
    this.setState({
      isLoggedIn: false
    })
  },

  render: function() {
    if(this.state.isLoggedIn) { setTimeout(this.lockForm, 5000) }
    const divStyle = {
      float: "left"
    }
    return (
      <div id="dashboard">
         <div className="row">
             <div className="col-xs-3">
               <NewConversation showConversations={this.showConversations}/>
               <ConversationList conversations={this.state.conversations} getDataFromConversation={this.getDataFromConversation} />
             </div>
             <div className="col-xs-9">
              <MessageList messages={this.state.messages}/>
              <MessageForm onSubmit={this.createMessage}/>
              <CtxForm onSubmit={this.createMessage}/>
            </div>
        </div>
      </div>
    )
  }
})

const NewConversation = React.createClass({

  startNewConversation: function() {
  //   const sendSearch = fetch('/users', {credentials: 'same-origin'})
  //   var self = this
  //
  //   function loadMyUsers(data) {
  //     data.json().then((jsonData) => {
  //       // console.log(jsonData)
  //       self.props.showConversations(jsonData)
  //
  //       self.setState({
  //         conversations: jsonData
  //       })
  //     })
  //   }
  //
  //   sendSearch.then(loadMyUsers)
  },

  render: function() {

    const bStyle= {
      border:'0px solid transparent'
    }

    const styling = {
      border: '1px solid black',
      padding: '5px',
      marginBottom: '1px',
      marginLeft: '1px',
      marginRight: '1px',
      marginTop: '5px'

    }

    return (
      <div style={styling} className="row">
          <div className='col-md-6 col-md-offset-3'>
            <h5 className='text-center'>Chats</h5>
          </div>
          <div className='col-xs-3'>
            <button style={bStyle} type="button" className="btn btn-default" onClick={this.startNewConversation} aria-label="Left Align">
              <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
            </button>
          </div>
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
      var urgentClass, urgentSpan
      if(m.urgent) {
        urgentClass='red'
        urgentSpan='show'
      } else {
        urgentClass='white'
        urgentSpan='hide'
      }

      // console.log(urgentClass)

      if(m.user_id != '58a39219fc4c98025a646ff1') {
        return (
          <div key={m.id} className="clearfix">
            <p className="bubble">{m.body}</p>
          </div>
        )
      } else if (m.user_id == '58a39219fc4c98025a646ff1' && m.context) {
        return (
          <div key={m.id} className="clearfix">
            <div className="bubble bubble--alt">
              <div className={urgentClass}>
                <p><span className={urgentSpan}>URGENT</span>This message has conTEXT</p>
                <p>{m.customContext}</p>
                <p>{m.body}</p>
              </div>
            </div>
          </div>
        )
      } else {
         return (
           <div key={m.id} className="clearfix">
             <p className="bubble bubble--alt">{m.body}</p>
           </div>
         )
      }
    })

    const divStyle = {
      border: "1px solid black",
      marginTop: '5px',
      padding: '10px'
    }

    return (

        <div style={divStyle} id="message-list">
          <br></br>
          {messages}
        </div>

    )
  }
})

const ConversationList = React.createClass({

  loadConversation: function(id) {
    const sendSearch = fetch('/conversations/' + id)
    var self = this

    function loadMyConversation(data) {
      data.json().then((jsonData) => {
        // console.log(jsonData.messages)
        self.props.getDataFromConversation(jsonData.messages, false, 0, "")
      })
    }

    sendSearch.then(loadMyConversation)
  },

  render: function() {

    const conversations = this.props.conversations.map((c) => {
      const pStyle = {
          marginTop: '-2px'
      }

        return (
          <div onClick={() => this.loadConversation(c.id)} key={c.id}>
            <hr style={pStyle}></hr>
            <p className="text-center">{c.user2}</p>
          </div>
        )
    })

    const divStyle = {
      border: "1px solid black",
      width: '100%'
    }

    return (

      <div style={divStyle} id="conversations-list">
        {conversations}
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

    const sendSearch = fetch('/messages', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _author: "58a39219fc4c98025a646ff1",
         to: "58a3a774c8a707068b15dd1c",
         body: this.refs.newMessage.value
      })
    })

    var self = this

    function loadMyUsers(data) {
      data.json().then((jsonData) => {
        console.log(jsonData);
        self.props.onSubmit(self.refs.newMessage.value, false, false)
        self.refs.newMessage.value = ''
      })
    }

    sendSearch.then(loadMyUsers)


  },

  showContextModal: function() {
     $('#ctx-form').show()
     $('#message-form').hide()
     this.refs.newMessage.value = ''
  },

// when i say onSubmit we want to prevent refresh of page from form
// we can use the event from the form onsubmit to prevent default behavior
  render: function() {
    return (
      <div id='message-form'>
        <br></br>

        <form onSubmit={this.handleSubmit}>
              <label className="sr-only" htmlFor="ex3">send message</label>
              <div className="input-group">
                <input className="form-control" id="ex3" type='text' ref='newMessage' placeholder="send message - press enter"/>
                <div className="input-group-addon" onClick={this.showContextModal}>conTEXT</div>
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
      urgentClickCount: 0,
      isUrgent: false,
      value: 'blank'
    }
  },

  handleSubmit: function(evt) {
    evt.preventDefault()
    var customctx = $("#ctxSelect option:selected").text()
    this.props.onSubmit(this.refs.ctxMessage.value, true, this.state.isUrgent, customctx)
    this.refs.ctxMessage.value = ''
    this.setState({isUrgent: false, value: 'blank'})
    $('#ctxBorder').removeClass('red')
    $('#ctx-form').hide()
    $('#message-form').show()
  },

  // change state of select options
  handleChange: function(event) {
    this.setState({value: event.target.value})
    console.log($("#ctxSelect option:selected").text())
  },

  // handel when user clicks close.. hide context form and show original input form
  handleClose: function(event) {
    this.setState({isUrgent: false, value: 'blank'})
    this.refs.ctxMessage.value = ''
    $('#ctx-form').hide()
    $('#ctxBorder').removeClass('red')
    $('#message-form').show()
  },

  handleUrgent: function() {
    $('#ctxBorder').toggleClass('red')
      this.setState({
        urgentClickCount: this.state.urgentClickCount+1,
        isUrgent: !this.state.isUrgent
      }, () => console.log(this.state))
  },

  // when i say onSubmit we want to prevent refresh of page from form
  // we can use the event from the form onsubmit to prevent default behavior
  render: function() {
    return (
      <div id='ctx-form'>
        <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <div id="ctxBorder">
                  <label htmlFor="ctx-area">What do you want to talk about?</label>
                  <textarea className="form-control"  id="ctx-area" ref='ctxMessage' rows="2"></textarea>
                  <br></br>
                  <label htmlFor="ctxSelect">Send custom context</label>
                  <select id="ctxSelect" value={this.state.value} onChange={this.handleChange}>
                    <option value="blank" ></option>
                    <option value="thinking">Thinking of you</option>
                    <option value="love">Love you</option>
                    <option value="miss">Miss you</option>
                    <option value="hurt">Feelings hurt</option>
                    <option value="upset">I am upset</option>
                    <option value="upset-you">I am upset at you</option>
                    <option value="angry">I am angry</option>
                    <option value="angry-you">I am angry at you</option>
                    <option value="ignore">I am ignoring you</option>
                    <option value="food">I want food</option>
                  </select>
                  <br></br>
                  <label htmlFor="urgent">Make it urgent</label>
                  <button id="urgentButton" type="button" className="btn btn-default" onClick={this.handleUrgent}>Urgent</button>
                  <button id="sendContextButton" type="button" className="btn btn-primary pull-right" onClick={this.handleSubmit}>Send</button>
                  <button type="button" className="btn btn-default pull-right" onClick={this.handleClose}>Close</button>
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
