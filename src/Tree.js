import React, {Component} from 'react';
import actions from './actions'
import {connect} from 'react-redux'


class Tree extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Children : props.data.children
        };

    }

    componentWillReceiveProps(newProps) {
        this.setState({
            Children : newProps.data.children
            });
    }

    buildSubtree(children) {
        let subtree = null;
        if (children.length > 0)
        {
            subtree = children.map(function (child)
            {
                return <Tree
                    onCurrentId={this.props.onCurrentId}
                    key={child.id}
                    data={child}
                />
            }.bind(this));
        }
        return subtree
    }

    handleAdd(eventType,event) {
        event.preventDefault();
        this.props.onCurrentId(eventType, this.props.data.id)
    }
    subtree = null
    render() {
        this.subtree = this.buildSubtree(this.state.Children);
        if (this.subtree != null) {
            return (
                    <li>
                    <a  data-id={this.props.data.id}>
                        <div>
                            <div>
                                {this.props.data.name}
                            </div>
                            <img src = {this.props.data.image} width={40} height={40} alt = "(ಥ﹏ಥ)"/>
                            <button onClick={this.handleAdd.bind(this,'KILL')}>-</button>
                            <button onClick={this.handleAdd.bind(this,'ADD')}>+</button>
                        </div>
                    </a>
                    <ul>
                        {this.subtree}
                    </ul>
                    </li>
            );
        }
        else {
            return (
                <li>
                    <a data-id = {this.props.data.id}>
                        <div>
                            <div>
                                {this.props.data.name}
                            </div>
                            <img src = {this.props.data.image} width={48} height={48} alt = "(ง'̀-'́)ง"/>
                            <button onClick={this.handleAdd.bind(this,'KILL')}>-</button>
                            <button onClick={this.handleAdd.bind(this,'ADD')}>+</button>
                        </div>
                    </a>
                </li>
            );
        }
    }
}

export default connect (
    state => ({
        testStore : state
    }),
    dispatch => ({
        onCurrentId : (type, id) => {
            dispatch(actions.currentId(type, id));
        }
    })
)(Tree);