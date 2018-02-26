import React, {Component} from 'react';

export default class Tree extends Component {

    constructor(props) {
        super(props);
        this.state = {
            node: {name:'', image:''},
            ConstructorUp : false,
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
                    key={child.id}
                    data={child}
                    callbackFromParent = {this.PassUpdate.bind(this)}
                />
            }.bind(this));
        }
        return subtree
    }
    UpdateSelf = (eventType) => {
        let Id = {id:this.props.data.id, type: eventType};
        this.props.callbackFromParent(Id);
    }

    PassUpdate = (FromChild) => {
        this.props.callbackFromParent(FromChild)
    }

    handleAdd(eventType,event) {
        event.preventDefault();

        this.UpdateSelf(eventType);
    }
    subtree = null
    render() {
        this.subtree = this.buildSubtree(this.state.Children)
        if (this.subtree != null) {
            return (
                    <li>
                    <a  data-id={this.props.data.id}>
                        <div>
                            <div>
                                {this.props.data.name}
                            </div>
                            <img src = {this.props.data.image} width={40} height={40}/>
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
                            <img src = {this.props.data.image} width={48} height={48}/>
                            <button onClick={this.handleAdd.bind(this,'KILL')}>-</button>
                            <button onClick={this.handleAdd.bind(this,'ADD')}>+</button>
                        </div>
                    </a>
                </li>
            );
        }
    }
};