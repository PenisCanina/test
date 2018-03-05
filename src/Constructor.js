import React, {Component} from 'react';
import actions from './actions'
import {connect} from 'react-redux'

class Constructor extends Component {
    constructor(props) {
        super(props)
        this.state = {
                node :
                {
                    image : '',
                    name : ''
                }
            };

    }
    handleSubmit(event) {
        event.preventDefault();
        console.log('form is submitted', this.state.node.name, this.state.node.image);
        this.props.onCurrentNode('set',this.state.node)
    }

    handleChange = (property) => (event) => {
        const node = this.state.node;
        const newNode = {
            ...node,
            [property]: event.target.value
        };
        this.setState({node : newNode});


    }

    render() {
        return (
            <form onSubmit = {this.handleSubmit.bind(this)}>
                <input
                    type = "text"
                    placeholder = "name"
                    value = {this.state.node.name}
                    onChange = {this.handleChange('name')}>
                </input>
                <input
                    type = "text"
                    placeholder = "image"
                    value = {this.state.node.image}
                    onChange = {this.handleChange('image')}>
                </input>
                <button onClick={this.handleSubmit.bind(this)}>+</button>
            </form>
        )
    }
}

export default connect(
    state => ({
        testStore : state
    }),
    dispatch => ({
        onCurrentId : (type, id) => {
            dispatch(actions.currentId(type, id));
        },
        onCurrentNode : (type, node) => {
            dispatch(actions.currentNode(type, node))
        }
    })

)(Constructor);