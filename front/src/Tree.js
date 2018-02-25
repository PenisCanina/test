import React, {Component} from 'react';
import Constructor from "./Constructor";
export default class Tree extends Component {

    constructor(props) {
        super(props);
        this.state = {
            node: {name:'', image:''},
            isOpened: props.opened,
            ConstructorUp : false,
            Children : props.data.children
            //TODO: ADD LOCAL STATE TREE STRUCTURE
        };
        this.subtree = this.buildSubtree();
    }
    subtree = null;
    componentWillReceiveProps(newProps) {
        this.setState({
            isOpened: !newProps.opened
        });
        this.subtree = this.buildSubtree();
    }

    toggleState() {
        this.setState({
            isOpened: !this.state.isOpened
        });
        this.subtree = this.buildSubtree()
    }

    buildSubtree() {
        let subtree = null;
        if (this.props.data.children)
        {
            subtree = this.props.data.children.map(function (child)
            {
                return <Tree
                    key={child.id}
                    data={child}
                    opened = {this.state.isOpened}
                    callbackFromParent = {this.PassUpdate.bind(this)}
                />
            }.bind(this));
        }
        return subtree;
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

    render() {
        let TreeText;
        if (this.state.isOpened) {
            TreeText = <div>Works</div>
        }
        else {
            TreeText = <div>Idle</div>
        }

        if (this.subtree) {
            return (
                <div className='tree-branch' style={{display: 'table', align : 'center', height: 100}}>
                    <a data-id={this.props.data.id} onClick={this.toggleState.bind(this)}>
                        <box className="box" >
                            {this.props.data.name}
                            {this.props.data.image}
                            <button onClick={this.handleAdd.bind(this,'ADD')}>+</button>
                            <button onClick={this.handleAdd.bind(this,'KILL')}>-</button>
                        </box>
                    </a>
                    <div className='tree-branch' style={{display:'inline-block', position: 'relative'}}>
                        {this.subtree}

                    </div>
                </div>
            );
        }
        else {
            return (
                <div  className='tree-leaf' >
                    <a data-id = {this.props.data.id} onClick={this.toggleState.bind(this)}>
                        <box className="box">
                            {this.props.data.name}
                            {this.props.data.image}
                            <button onClick={this.handleAdd.bind(this,'ADD')}>+</button>
                            <button onClick={this.handleAdd.bind(this,'KILL')}>-</button>
                        </box>
                    </a>
                </div>
            );
        }
    }
};