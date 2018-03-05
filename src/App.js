import React, {Component} from 'react';
import axios from 'axios';
import Constructor from'./Constructor'
import Tree from './Tree';
import  './tree.css'
import actions from './actions'
import {connect} from 'react-redux'

class App extends Component {

    constructor(props)
    {
        super(props)
        this.FetchTree()
    }

    FetchTree() {
        axios.get('http://localhost:3001/tree').then(
            resp => {
                if(resp.data.result !== "") {
                    let treeData = [JSON.parse(resp.data.result)];
                    this.props.onFetchTree(treeData.map(function (child) {
                        return <Tree
                            key={child.id}
                            data={child}
                        />
                    }));
                } else {
                    this.props.onCurrentId('ADD', 0)
                    this.props.onFetchTree(null)
                }

            }
        )
    }

    ChildAdd(id, name, img) {
        var params = new FormData();
        params.set('name', name);
        params.set('image', img);
        axios.post('http://localhost:3001/add?id='+id, params)
            .then( resp => {
                console.log(resp.data)
                this.FetchTree();
            })
            .catch( err => console.log(err))

    }

    ChildKill (id){
        axios.delete('http://localhost:3001/kill?id='+id)
            .then( resp => {
                console.log(resp.data)
                this.FetchTree();
            })
            .catch( err => console.log(err))
    }

    renderConstructor() {
            return (<Constructor/>)
    }

    shouldComponentUpdate(newProps) {
        if (newProps.testStore.CurrentId != null) {
            switch(newProps.testStore.CurrentId.type) {
                case 'ADD': {
                    if (newProps.testStore.NodeForm != null) {
                        this.ChildAdd(
                            newProps.testStore.CurrentId.id,
                            newProps.testStore.NodeForm.name,
                            newProps.testStore.NodeForm.image
                        );
                        console.log('ADD_CHILD:', newProps.testStore.NodeForm.name, ' ', newProps.testStore.NodeForm.image, ' to ', this.props.testStore.CurrentId.id);
                        newProps.onCurrentId();
                        newProps.onCurrentNode('set', null);
                        return false
                    }
                    return true
                }
                case 'KILL': {
                    this.ChildKill(newProps.testStore.CurrentId.id);
                    console.log('KILL_CHILD', newProps.testStore.CurrentId.id,' & All it`s children')
                    newProps.onCurrentId();
                    return false
                }
            }
        }
            return true
        }



    render() {
        var constructorUp = false;
        if(this.props.testStore.CurrentId != null) {
            constructorUp = true;
            console.log('yup, we rendered')
        }

        return (
            <div>
                {constructorUp ? this.renderConstructor() : null }

                <div className= "tree" >
                <ul>
                    {this.props.testStore.Tree}
                </ul>
            </div>
            </div>
          )
  }
}

export default connect (
    state => ({
        testStore : state
    }),
    dispatch => ({
        onFetchTree: (tree) => {
            dispatch(actions.fetchTree(tree));
        },
        onCurrentId: (type, id) => {
            dispatch(actions.currentId(type, id))
        },
        onCurrentNode : (type, node) => {
            dispatch(actions.currentNode(type, node))
        }
    })
)(App);