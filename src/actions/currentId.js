const currentId = (type=null, id=null) => ({
    type: type,
    payload : id
})

export default currentId;