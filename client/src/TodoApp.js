import React, { Component } from 'react'
import axios from "axios"

const url = "http://localhost:4000/todos"

const NavBar = () => {
    return (<nav className="navbar navbar-light bg-light">
        <span className="navbar-brand mb-0 h1">The React Todo List</span>
    </nav>)
}

const List = ({ todos, markDone}) => {
    return todos.map(todo => {
        return <Todo todo={todo} markDone={markDone}/>
    })
}

const Todo = ({ todo, markDone }, i) => {
    return (
        <ul className="no-padding">
            <li key={i} className="list-unstyled">
                <label onClick={() => markDone(todo)}>{todo.text}</label>
            </li>
            <hr />
        </ul>
    )
}

const Done = ({list, markUndone, delet}) => {
    return list.map(done => {
        return (
            <ul id="done-items" className="list-unstyled">
                <li className="list-unstyled done" >
                    <label onClick={() => markUndone(done)}>{done}</label>
                    <button  className="btn float-right paddingZero" onClick={() => delet(done)}><i aria-hidden="true" className="fa fa-trash red"></i></button>
                </li>
            </ul>
        )
    }) 
}

export default class TodoApp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            todos: ['Take out the trash', 'rdv Dentist'],
            done: [], 
            input: ''
        }
    }
  
  componentDidMount() {
    this.fetch()
  }
  
  fetch = () => {
    axios
      .get(url + '/')
      .then(res => {
        console.log(res.data)
        this.setState({todos: res.data})
      })
  }

    add = (e) => {
      if (e.key === 'Enter') {
        let todo = {text: this.state.input, isCompleted: false}
        axios
          .post('http://localhost:4000/todos/add', todo)
          .then(res => {
            console.log(res.data)
            console.log("Outstanding!")
            this.fetch( )

          }
          )
            // this.state.todos.unshift(this.state.input)
            // this.setState({todos: this.state.todos})
        // e.target.value = ''
        } 
    }

    onChange = (input) => {
        this.setState({input: input})
    }

    markDone = (todo) => {
        let list = this.state.todos.filter(t => {
            return t !== todo
        })
        this.state.done.push(todo)
        this.setState({done: this.state.done, todos: list})
    }

    markUndone = (todo) => {
        let list = this.state.done.filter(t => {
            return t !== todo
        })
        this.state.todos.push(todo)
        this.setState({done: list, todos: this.state.todos})
    }

    delete = (done) => {
        let list = this.state.done.filter(t => {
            return t !== done
        })
        this.setState({done: list})
    }

    render() {
        return (
            <div>
                <NavBar />
                <div className="container">
                    <br />
                    <div className="row">

                        <div className="col-md-6">
                            <div className="todolist not-done">
                                <input type="text" className="form-control add-todo btn-lg" placeholder="Add todo" 
                                onChange={(e) => this.onChange(e.target.value)}
                                onKeyDown={(e) => this.add(e, this.state.input)}/>
                                <br />
                                <List todos={this.state.todos} markDone={this.markDone}/>
                                <div className="todo-footer">
                                    <strong><span className="count-todos">{this.state.todos.length}</span></strong> Items Left
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="todolist">
                                <h3>Done</h3>
                                <Done list={this.state.done} markUndone={this.markUndone} delet={this.delete}/>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}