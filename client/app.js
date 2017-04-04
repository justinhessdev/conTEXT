// instantiate component and what we put in contains all its properties
// a compnent in react must be able to get rendered / be visible
// every component in react has a keyword render -- react looks for it
//get intital state is not required by every component but it returns our state object which contains an array of messages
// a data representatino of what will appear in the front end
// now we can call this.state to access messages in getInitialState
// take array and map it to something renerable - like MessageForm component
// Dashboard won't 'render' until 'getInitialState' is complete ---- lifecycle
// setState is accesible by all componenets

var socket = io.connect()

// socket.on('new-message', (data) => {
//     console.log("ALL CLIENTS SHOULD GET THIS MESSAGE")
//     console.log(Dashboard)
//     Dashboard.createMessage(data.id, data.body, data.context, data.urgent, data.customContext)
// })

// class SocketListener extends React.Component {
//   state: function() {
//     return
//     (
//       messages: []
//     )
//   }
//   componentDidMount: function() {
//     socket.on('new-message', (data) => {
//       this.setState({ messages: this.state.messages.concat(data) })
//     });
//   }
//
//   render: function() {
//     return (
//       <Dashboard
//         messages={this.state.messages}
//       />
//     )
//   }
// }

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
      users: [],
      conversations: [],
      currentConversation: [],
      startedConversationWith: {},
      currentUser: "",
      to: ""
    }
  },

  componentWillMount: function() {

      const currentUserLoggedIn = fetch('/status', {credentials: 'same-origin'})

      var self = this

      function grabUserId(data) {
        data.json().then((jsonData) => {
          // console.log(jsonData)
          if(!jsonData.status) {
            self.setState({
              currentUser: ""
            })

            // console.log("Not logged in the current logged in user is: ")
            // console.log(self.state.currentUser)
            window.location = '/login'
          }

          self.setState({
            currentUser: jsonData.user._id
          })
        }).then(proceedIfLoggedIn)
      }

      function loadMyUsers(data) {
        data.json().then((jsonData) => {
          self.showConversationListInfo(jsonData)

        })
      }

      function proceedIfLoggedIn() {
        // console.log("The currently logged in user is: ")
        // console.log(self.state.currentUser)
        const sendSearch = fetch('/conversations', {credentials: 'same-origin'})

        sendSearch.then(loadMyUsers)
      }

      currentUserLoggedIn.then(grabUserId)


  },

  componentDidMount: function() {
    socket.on('new-message', (data) => {
        console.log("In original app - ALL CLIENTS SHOULD GET THIS MESSAGE")
        // console.log(Dashboard)
        this.createMessage(data.id, data.body, data.context, data.urgent, data.customContext)
    })

    socket.on('new-message-from-jj-to-joe', (data) => {
        console.log("In original app - new message received from jj to joe")
        console.log(data)
        this.createMessageFromJJToJoe(data.id, data.body, data.context, data.urgent, data.customContext)
    })
  },

  // .map will return new array based on original one, formated how we choose

  createMessageFromJJToJoe: function(id, body, context, urgent, customContext) {

    this.setState({
      isLoggedIn: false,
      messages: [
        ...this.state.messages,
        {id: id, user_id: "58a743735adab10011e223d9", body: body, context: context, urgent: urgent, customContext: customContext}
      ]
    })
  },

  createMessage: function(id, body, context, urgent, customContext) {

    this.setState({
      isLoggedIn: false,
      messages: [
        ...this.state.messages,
        {id: id, user_id: this.state.currentUser, body: body, context: context, urgent: urgent, customContext: customContext}
      ]
    })
  },

  getDataFromConversation: function(user1, user2, messages) {
    var newMessages = []
    messages.map((message) => {
      newMessages.push({id: message._id, user_id:message._author._id, body: message.body, context: message.context, urgent: message.urgent, customContext: message.customContext})

    })

    // console.log("Here we are loading all messages from conversation")
    // console.log(newMessages)

    this.setState({
      messages: newMessages,
      to: user2._id
    })

  },

  showConversationListInfo: function(data) {
    var conversationData = []
    data.map((d) => {
      conversationData.push({id: d._id, user1: d.user1, user2: d.user2})
    })

    this.setState({
      conversations: conversationData
    })
  },

  lockForm: function() {
    this.setState({
      isLoggedIn: false
    })
  },

  setCurrentConversation: function(conversation) {
    this.setState({
      currentConversation: conversation
    })
  },

  showUsersForNewConversation: function(users) {
    $('#users-list').show()
    var usersArray = []
    users.map((u) => {
      usersArray.push(u)
    })

    this.setState({
      users: usersArray
    })

    // console.log("All the users are: ")
    // console.log(this.state.users)
  },

  updateConversationList: function(conversation) {
    // console.log("I am adding the new converstaion to state conversations: ")
    // console.log(conversation)
    var updateConvoArr = []
    this.state.conversations.map((c) => {
      updateConvoArr.push(c)
    })


    updateConvoArr.push({id:conversation._id, user1: conversation.user1, user2: conversation.user2})

    this.setState({
      conversations: updateConvoArr
    })

    // console.log("There should be a new conversation now: ")
    // console.log("Array size is now: " + this.state.conversations.length)
    // console.log(this.state.conversations)
  },

  startConvoWith: function(user) {
    this.setState({
      startedConversationWith: user
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
               <NewConversation showUsersForNewConversation={this.showUsersForNewConversation}/>
               <ConversationList conversations={this.state.conversations} getDataFromConversation={this.getDataFromConversation} currentConversation={this.setCurrentConversation} currentUser={this.state.currentUser} sendTo={this.state.to} startConvoWith={this.state.startedConversationWith}/>
               <SelectUserForNewConversation users={this.state.users} currentUser={this.state.currentUser} addConversation={this.updateConversationList} startConvoWith={this.startConvoWith}/>
           </div>
             <div className="col-xs-9">
              <MessageList messages={this.state.messages} currentUser={this.state.currentUser} />
              <MessageForm onSubmit={this.createMessage} messages={this.state.messages} currentConversation={this.state.currentConversation} currentUser={this.state.currentUser} sendTo={this.state.to}/>
              <CtxForm onSubmit={this.createMessage} messages={this.state.messages} currentConversation={this.state.currentConversation} currentUser={this.state.currentUser} sendTo={this.state.to}/>
            </div>
        </div>
      </div>
    )
  }
})

const NewConversation = React.createClass({

  startNewConversation: function() {
    $('#conversations-list').hide()
    const sendSearch = fetch('/users', {credentials: 'same-origin'})
    var self = this

    function loadMyUsers(data) {
      data.json().then((jsonData) => {
        // console.log(jsonData)
        self.props.showUsersForNewConversation(jsonData)

      })
    }

    sendSearch.then(loadMyUsers)
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
      // console.log("in messagelist - Now that we have sent message to db and added it to state let's print it out")
      // console.log(m)
      var urgentClass, urgentSpan
      if(m.urgent) {
        urgentClass='red'
        urgentSpan='show'
      } else {
        urgentClass='white'
        urgentSpan='hide'
      }

      // console.log(urgentClass)
      if (m.user_id != this.props.currentUser && m.context) {
        return (
          <div key={m.id} className="clearfix">
            <div className="bubble">
              <div className={urgentClass}>
                <p><span className={urgentSpan}>URGENT</span>This message has conTEXT</p>
                <p>{m.customContext}</p>
                <p>{m.body}</p>
              </div>
            </div>
          </div>
        )
      } else if(m.user_id != this.props.currentUser) {
        return (
          <div key={m.id} className="clearfix">
            <p className="bubble">{m.body}</p>
          </div>
        )
      } else if (m.user_id == this.props.currentUser && m.context) {
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
      padding: '10px',
      height: '400px',
      overflowY: 'scroll'
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

  loadConversation: function(conversation) {
    // console.log("the current conversation is: ")
    // console.log(conversation)
    this.props.currentConversation(conversation)
    const sendSearch = fetch('/conversations/' + conversation.id)
    var self = this

    function loadMyConversation(data) {
      data.json().then((jsonData) => {
        // console.log(jsonData)
        self.props.getDataFromConversation(jsonData.user1, jsonData.user2, jsonData.messages)
      })
    }

    sendSearch.then(loadMyConversation)
  },

  render: function() {

    const conversations = this.props.conversations.map((c) => {

      const pStyle = {
          marginTop: '-2px'
      }

      var displayNotCurrentUser

      if(c.user2._id == this.props.currentUser || c.user1._id == this.props.currentUser){
        if(c.user1._id == this.props.currentUser) {
          displayNotCurrentUser = c.user2.local.name
        } else if(c.user2._id == this.props.currentUser) {
          displayNotCurrentUser = c.user1.local.name
        }

          return (
            <div key={c.id} onClick={() => this.loadConversation(c)} >
              <hr style={pStyle}></hr>
              <p className="text-center">{displayNotCurrentUser}</p>
            </div>
          )
      }
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

const SelectUserForNewConversation = React.createClass({


  loadEmptyConversation: function(currentUser, user2){

    var self = this

    const startConversation = fetch('/conversations', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         user1: currentUser,
         user2: user2._id,
         messages: []
      })
    })

    function beginConversation(data) {

      self.props.startConvoWith(user2)
      data.json().then((jsonData) => {
        // console.log("The new conversation is: ")
        // console.log(jsonData)
        self.props.addConversation(jsonData.conversation)

        $('#conversations-list').show()
        $('#users-list').hide()


      })
    }

    startConversation.then(beginConversation)
  },

  render: function() {

    const users = this.props.users.map((u) => {
      const pStyle = {
          marginTop: '-2px',
          padding: '5px',
      }

      const bStyle = {
        border:'0px solid transparent',
        background: 'gray',
        marginBottom:'10px',
        color: 'white'

      }
      const dStyle = {
        marginRight: '1px',
        color: 'white'
      }

      if(u._id != this.props.currentUser){
        return (
          <div onClick={() => this.loadEmptyConversation(this.props.currentUser, u)} key={u._id}>
            <div className="row">
              <hr style={pStyle}></hr>
              <div className="col-xs-3 col-xs-offset-2">
                <button style={bStyle} type="button" className="btn btn-default pull-right" aria-label="Left Align">
                  <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
                </button></div>
              <div style={dStyle} className="col-xs-6">
                <p className="">{u.local.name}</p>
              </div>
            </div>
        </div>
        )
      }
    })

    const divStyle = {
      border: "1px solid black",
      width: '100%',
      background: 'gray'
    }

    return (

      <div style={divStyle} id="users-list">
        {users}
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
        _author: this.props.currentUser,
         to: this.props.sendTo,
         body: this.refs.newMessage.value
      })
    })

    var self = this
    var id
    var obj

    function loadMyMessage(data) {
      data.json().then((jsonData) => {
        // console.log(jsonData);
        id = jsonData._id
        // console.log(id);
        obj = {id:id, body:self.refs.newMessage.value, context:false, urgent:false, customContext:""}
        // self.props.onSubmit(id, self.refs.newMessage.value, false, false, "")
        self.refs.newMessage.value = ''
      }).then(patchConversation)
    }

    function patchConversation() {
      var ids = []
      self.props.messages.map((message) => {
        // console.log(message)
         ids.push(message.id)
      })

      ids.push(obj.id) // push the newest message

      // console.log(ids)
      // console.log("In message form - the current conversation is: ")
      // console.log(self.props.currentConversation)
      const patchSearch = fetch('/conversations/'+self.props.currentConversation.id, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
           user1: self.props.currentConversation.user1._id,
           user2: self.props.currentConversation.user2._id,
           messages: ids
        })
      }).then(emitConversation)
    }

    function emitConversation() {
      console.log("obj is: ")
      console.log(obj)
      socket.emit('send-message', obj);
    }

    // patchSearch.then(loadPatch)
    sendSearch.then(loadMyMessage)


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
    var cc = $("#ctxSelect option:selected").text()
    evt.preventDefault()


        var self = this
        var id
        var obj

    const sendSearch = fetch('/messages', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _author: self.props.currentUser,
         to: self.props.sendTo,
         body: self.refs.ctxMessage.value,
         context: true,
         urgent: self.state.isUrgent,
         customContext: cc
      })
    })

    function loadMyMessage(data) {
      data.json().then((jsonData) => {
        // console.log("The message we received from server is: ")
        // console.log(jsonData)
        id = jsonData._id
        // console.log(id);
        var customctx = $("#ctxSelect option:selected").text()
        obj = {id:id, body:self.refs.ctxMessage.value, context:true, urgent:self.state.isUrgent, customContext:customctx}
        // self.props.onSubmit(id, self.refs.ctxMessage.value, true, self.state.isUrgent, customctx)
        self.refs.ctxMessage.value = ''
        self.setState({isUrgent: false, value: 'blank'})
        $('#ctxBorder').removeClass('red')
        $('#ctx-form').hide()
        $('#message-form').show()
      }).then(patchConversation)
    }

    function patchConversation() {
      var ids = []
      self.props.messages.map((message) => {
        // console.log(message)
         ids.push(message.id)
      })

      ids.push(obj.id)

      // console.log(ids)
      // console.log("In message form - the current conversation is: ")
      // console.log(self.props.currentConversation)
      const patchSearch = fetch('/conversations/'+self.props.currentConversation.id, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
           user1: self.props.currentConversation.user1._id,
           user2: self.props.currentConversation.user2._id,
           messages: ids
        })
      }).then(emitConversation)
    }

    function emitConversation() {
      console.log("obj is: ")
      console.log(obj)
      socket.emit('send-message', obj);
    }

    // patchSearch.then(loadPatch)
    sendSearch.then(loadMyMessage)



  },

  // change state of select options
  handleChange: function(event) {
    this.setState({value: event.target.value})
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
      })
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
