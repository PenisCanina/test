import React, {Component} from 'react';
import axios from 'axios';

import Constructor from'./Constructor'
import Tree from './Tree';
import './viewer.css';


class App extends Component {


    constructor(props)
    {
        super(props)
        this.state = {
            currentId : null,
            constructorUp: false,
            received : null,
            tree: null
        }
        this.FetchTree()
    }
    FetchTree() {
        axios.get('http://localhost:3001/tree').then(
            resp => {
                this.setState({
                received: resp.data.result
                })
                //console.log('received: ', this.state.received)
                if(this.state.received != "") {
                    console.log(this.state.received )
                    let treeData = [JSON.parse(this.state.received)];
                    this.setState({
                        tree: treeData.map(function (child) {
                            return <Tree
                                key={child.id}
                                data={child}
                                opened={true}
                                callbackFromParent = {this.IdCallBack.bind(this)}
                            />
                        }.bind(this))
                    })
                }
                //console.log('tree: ',this.state.tree)
            }
        )
        console.log('render request', this.state.tree)
        this.render()
    }

    ChildAdd(id, name, img) {
        var params = new FormData();
        params.set('name', name);
        params.set('image', img);
        axios.post('http://localhost:3001/add?id='+id, params)
            .then( resp => console.log(resp.data))
            .catch( err => console.log(err))
        this.FetchTree();
    }

    DataCallback = (FormData) => {
        this.setState({constructorUp:false});
        console.log('ADD_CHILD:',FormData.name, ' ', FormData.image,' to ', this.state.currentId);
        this.ChildAdd(this.state.currentId.id, FormData.name, FormData.image);
        this.FetchTree();
    }


    IdCallBack = (FromChild) => {
        this.setState({currentId:FromChild});
        console.log(FromChild)
        this.setState({constructorUp: FromChild['type'] == 'ADD'?true:false})
    }

    renderConstructor(DataCallback) {
            return (<Constructor callbackFromParent = {DataCallback} />)
    }
    render() {
        console.log('rendered', this.state.tree)

        return (
            <body className= 'viewer'>
                {this.state.constructorUp ? this.renderConstructor(this.DataCallback.bind(this)) : null }
                {this.state.tree}
            </body>
          )
  }
}

export default App;