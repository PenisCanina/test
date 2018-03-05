const currentNode = (type = 'set', node) => ({
    type: type,
    payload : node
})

export default currentNode;