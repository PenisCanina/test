import React, {Component} from 'react';
import axios from 'axios';

import Constructor from'./Constructor'
import Tree from './Tree';
import  './tree.css'


class App extends Component {


    constructor(props)
    {
        super(props)
        this.state = {
            currentId : {id: null, type : null},
            constructorUp: false,
            tree: null
        }
        this.FetchTree()
    }
    FetchTree() {
        axios.get('http://localhost:3001/tree').then(
            resp => {
                if(resp.data.result != "") {
                    //console.log(this.state.received )
                    let treeData = [JSON.parse(resp.data.result)];
                    this.setState({
                        tree: treeData.map(function (child) {
                            return <Tree
                                key={child.id}
                                data={child}
                                callbackFromParent = {this.IdCallBack.bind(this)}
                            />
                        }.bind(this))
                    })
                } else {
                    this.setState({constructorUp: true, currentId : {id : 0, type : 'ADD'}, tree : null})
                }

            }
        )
        //this.setState({})
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

    DataCallback = (FormData) => {
        this.setState({constructorUp:false});
        console.log('ADD_CHILD:',FormData.name, ' ', FormData.image,' to ', this.state.currentId);
        if (this.state.currentId.type == 'ADD') {
            this.ChildAdd(this.state.currentId.id, FormData.name, FormData.image)
        }

    }


    IdCallBack = (FromChild) => {
        this.setState({currentId:FromChild});
        console.log(FromChild)
        this.setState({constructorUp: FromChild['type'] == 'ADD'?true:false})
        if(FromChild['type'] == 'KILL'){
            this.ChildKill(FromChild['id'])
            this.FetchTree();
        }
    }

    renderConstructor(DataCallback) {
            return (<Constructor callbackFromParent = {DataCallback} />)
    }

    render() {
        return (
            <div>
                {this.state.constructorUp ? this.renderConstructor(this.DataCallback.bind(this)) : null }

                <div className= "tree" >
                <ul>
                    {this.state.tree}
                </ul>
            </div>
            </div>
          )
  }
}

export default App;