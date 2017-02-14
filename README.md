# conTEXT

## we put the text in context

### Instantly know why you are being texted

###### Send instant messages
![Alt text](./client/img/message_list.png?raw=true "Optional Title")

###### Send instant messages with context
![Alt text](./client/img/send_plain_context.png?raw=true "Optional Title")

###### Add urgent context
![Alt text](./client/img/add_context.png?raw=true "Optional Title")

###### Send urgent context
![Alt text](./client/img/send_urgent_context.png?raw=true "Optional Title")


#### Technologies used: REACT | Node.js | Express | MongoDB

React is used for the client side application. The front end is
comprised of our React components: Dashboard, MessageList,
MessageForm, and CtxForm

##### The React Dashboard renders the other Components:

	render: function() {
	    return (
	      <div id="dashboard">
	        <MessageList messages={this.state.messages}/>
	        <MessageForm onSubmit={this.createMessage}/>
	        <CtxForm onSubmit={this.createMessage}/>
	      </div>
	    )
  	}