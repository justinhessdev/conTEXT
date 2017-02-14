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

  render: function() {
    return (
      <div className="col-sm-6 col-sm-offset-3">
          <h1>Login</h1>
          <form action="/login" method="post">
              <div className="form-group">
                  <label>Email</label>
                  <input type="text" className="form-control" name="email"></input>
              </div>
              <div className="form-group">
                  <label>Password</label>
                  <input type="password" className="form-control" name="password"></input>
              </div>
              <button type="submit" className="btn btn-info btn-lg">Login</button>
          </form>
          <hr></hr>
          <p>Or, <a href="/signup">Signup</a></p>
          <p>Go back <a href="/">home</a>.</p>
      </div>
    )
  }
})


//react-dom helps us render / append to front end / DOM
// takes two args -- 1. what to render 2. where to render
ReactDOM.render(<Dashboard />, document.getElementById('login'))
