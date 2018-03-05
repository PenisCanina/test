const fetchTree = tree => ({
    type: 'fetch',
    // payload: tree.map(function (child) {
    //     return <Tree
    //         key={child.id}
    //         data={child}
    //         callbackFromParent = {this.IdCallBack.bind(this)}
    //     />
    // }.bind(this))
    payload : tree
})

export default fetchTree;