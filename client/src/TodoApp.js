import React, { Component } from 'react'
import axios from 'axios'

const url = 'http://localhost:4000/todos'

const title = 'Todo App'

const NavBar = () => {
  return (
    <nav className='navbar navbar-light bg-light'>
      <span className='navbar-brand mb-0 h1'>{title}</span>
    </nav>
  )
}

const List = ({ todos, check }, i) => {
  return todos.map(todo => {
    return <Todo key={i} todo={todo} check={check} />
  })
}

const Todo = ({ todo, check }, i) => {
  return (
    <ul className='no-padding'>
      <li key={i} className='list-unstyled'>
        <label onClick={() => check(todo)}>{todo.text}</label>
      </li>
      <hr />
    </ul>
  )
}

const Done = ({ list, check, delet }, i) => {
  return list.map(todo => {
    return (
      <ul key={i} id='done-items' className='list-unstyled'>
        <li className='list-unstyled done'>
          <label onClick={() => check(todo)}>{todo.text}</label>
          <button className='btn float-right paddingZero' onClick={() => delet(todo)}><i aria-hidden='true' className='fa fa-trash red' /></button>
        </li>
      </ul>
    )
  })
}

export default class TodoApp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      todos: ['Take out the trash', 'rdv Dentist'],
      done: [],
      input: ''
    }
  }

  componentDidMount () {
    this.fetch()
  }

  fetch () {
    axios
      .get(url + '/')
      .then(res => {
        this.filter(res.data)
      })
  }

  filter (all) {
    const todos = all.filter(todo => !todo.isCompleted)
    const done = all.filter(todo => todo.isCompleted)
    console.log(all)
    this.setState({ todos: todos, done: done })
  }

  add (e) {
    if (e.key === 'Enter') {
      const todo = { text: this.state.input, isCompleted: false }
      axios
        .post('http://localhost:4000/todos/add', todo)
        .then(res => {
          console.log(res.data)
          console.log('Outstanding!')
          this.fetch()
        }
        )
    }
  }

  onChange (input) {
    this.setState({ input: input })
  }

  check (todo) {
    axios
      .put(`https://localhost:4000/todos/${todo._id}`, todo)
      .then(res => {
        console.log(res.data)
        this.fetch()
        this.setState({ todos: res.data })
      })
  }

  delete (done) {
    const list = this.state.done.filter(t => {
      return t !== done
    })
    this.setState({ done: list })
  }

  render () {
    return (
      <div>
        <NavBar />
        <div className='container'>
          <br />
          <div className='row'>

            <div className='col-md-6'>
              <div className='todolist not-done'>
                <input
                  type='text' className='form-control add-todo btn-lg' placeholder='Add todo'
                  onChange={(e) => this.onChange(e.target.value)}
                  onKeyDown={(e) => this.add(e, this.state.input)}
                />
                <br />
                <List todos={this.state.todos} check={this.check} />
                <div className='todo-footer'>
                  <strong><span className='count-todos'>{this.state.todos.length}</span></strong> Items Left
                </div>
              </div>
            </div>

            <div className='col-md-6'>
              <div className='todolist'>
                <h3>Done</h3>
                <Done list={this.state.done} check={this.check} delet={this.delete} />
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }
}
