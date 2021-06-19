import React, { Component } from 'react'
import './Todo.css'
import TrashIcon from './TrashIcon'

export default class TodoApp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      items: [
        { text: 'create app', done: true, key: new Date().getMilliseconds() + 1 },
        { text: 'install modules', done: true, key: new Date().getMilliseconds() + 2 },
        { text: 'start dev', done: true, key: new Date().getMilliseconds() + 3 },
        { text: 'try this app', done: false, key: new Date().getMilliseconds() + 4 },
        { text: 'add done list', done: false, key: new Date().getMilliseconds() + 5 },
        { text: 'optimize compos', done: false, key: new Date().getMilliseconds() + 6 },
        { text: 'add reactive state', done: false, key: new Date().getMilliseconds() + 7 }
      ],
      input: ''

    }
  }

  move (key) {
    console.log(key)
    const filtered = this.state.items.map((item) => {
      if (item.key === key) {
        item.done = !item.done
      }
      return item
    })
    this.setState({ items: filtered })
    //   return done=true
  }

  add () {
    // console.log(this.state.input)
    let { items, input } = this.state
    items = [...items, { text: input, done: false, key: new Date().getMilliseconds() + items.length }]
    this.setState({ items })
  }

  handleChange (evt) {
    // console.log(evt.target.value)
    this.setState({ input: evt.target.value })
  }

  getUndone () {
    const undone = this.state.items.filter(({ done }) => done === false)
    return undone
  }

  deleteItem (key) {
    const filtered = this.state.items.filter(item => {
      return item.key !== key
    })
    // console.log(filtered)
    this.setState({ items: filtered })
  }

  // this.handleChange = this.handleChange.bind(this)

  render () {
    return (
      <div className='container'>
        <nav class='navbar navbar-light bg-light'>
          <div class='container-fluid'>
            <span class='navbar-brand mb-0 h1 text-uppercase'>Todo App</span>
          </div>
        </nav>
        <br />
        <div className='row'>
          <div className='col-md-6'>
            <div className='todolist not-done'>
              <form onSubmit={(evt) => { evt.preventDefault(); this.add() }}>
                <input className='form-control' value={this.state.input} onChange={evt => this.handleChange(evt)} placeholder='enter a task' />
                <div className='d-grid'>

                  <button type='submit' className='btn btn-outline-warning'>Enter</button>
                </div>
              </form>
              <br />
              <ul className='no-padding' id='not-done'>
                {
                  this.state.items.map(({ text, done, key }) => {
                    return (done || (
                      <li className='list-unstyled' key={key}>
                        <label onClick={() => this.move(key)}>
                          {text}

                        </label>
                      </li>
                    ))
                  })
                }
              </ul>
              {this.getUndone().length > 0
                ? <div className='todo-footer'>{this.getUndone().length} tasks left</div>
                : <div className='todo-footer'>todolist clear</div>}
            </div>

          </div>
          <div className='col-md-6'>
            <div className='todolist'>
              <ul className='no-padding' id='done-items'>
                {
                  this.state.items.map(({ text, done, key }) => {
                    return (done && (
                      <li className='list-unstyled' key={key}>
                        <label onClick={() => this.move(key)}>
                          {text}

                        </label>
                        <button className=' btn btn-sm  float-end p-0 ' onClick={e => this.deleteItem(key)} title={`delete ${text}`}>
                          <TrashIcon />

                        </button>
                      </li>
                    ))
                  })
                }
              </ul>

            </div>
          </div>
        </div>
      </div>
    )
  }
}
