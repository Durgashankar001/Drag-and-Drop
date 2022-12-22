import { useToast } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'

const Drop = ({ data }) => {

    // All State Manage here

    const [myData, setMydata] = useState(data)
    const [drag, setDrag] = useState(false)
    const [addData, setAddData] = useState("")
    const [modal, setModal] = useState(false)
    const [group, setGroup] = useState("")
    const toast = useToast()
    const dragElement = useRef()
    const dragItem = useRef()


    // Drag Start Function to check which element is to be dragg
    const handleStart = (e, query) => {
        dragItem.current = query
        dragElement.current = e.target
        dragElement.current.addEventListener("dragend", handleEnd)
        setTimeout(() => {
            setDrag(true)
        }, 0)

    }

    // Main Drag Function to Update the data with the help of drag element
    const handleDrag = (e, query) => {
        const cur_item = dragItem.current
        if (dragElement.current !== e.target) {
            setMydata(pre => {
                let newData = JSON.parse(JSON.stringify(pre))
                let x = newData[cur_item.group_I].items.splice(cur_item.item_I, 1)[0]
                x.color = newData[query.group_I].color
                newData[query.group_I].items.length < 8 && newData[query.group_I].items.splice(query.item_I, 0, x)
                dragItem.current = query
                localStorage.setItem("zino_tech_list_darg_drop_dp", JSON.stringify(newData))
                return newData
            })
        }
    }

    //Drag End Function
    const handleEnd = () => {
        dragElement.current.removeEventListener("dragend", handleEnd)
        dragItem.current = null
        dragElement.current = null
        setDrag(false)
    }


    // On Drag change the style of the element
    const myStyle = (query, color) => {
        const cur = dragItem.current
        if (cur.group_I === query.group_I && cur.item_I === query.item_I) {
            return "#4f5666"
        }
        return color
    }


    const myStyleColor = (query, color) => {
        const cur = dragItem.current
        if (cur.group_I === query.group_I && cur.item_I === query.item_I) {
            return "#4f5666"
        }
        return "white"
    }


    //Delete Function delete the data and update the state
    const handleDelete = (e, query) => {
        setMydata(pre => {
            let newData = JSON.parse(JSON.stringify(pre))
            newData[query.group_I].items.splice(query.item_I, 1)
            localStorage.setItem("zino_tech_list_darg_drop_dp", JSON.stringify(newData))
            return newData
        })
    }
    //Add Function to add the data and update the state
    const handleAdd = (e, query) => {
        e.preventDefault()
        group == "" ? query.group_I : query.group_I = group
        if (addData == "") {
            toast({
                title: `Please add some text to enter`,
                position: "top-right",
                status: "warning",
                isClosable: true,
                duration: 5000,
            })
        } else {
            // update the color through the group Id
            let color
            if (query.group_I == 0) color = "red"
            else if (query.group_I == 1) color = "blue"
            else if (query.group_I == 2) color = "green"
            else if (query.group_I == 3) color = "black"
            else {
                toast({
                    title: `Something went wrong to get color`,
                    position: "top-right",
                    status: "warning",
                    isClosable: true,
                    duration: 5000,
                })
            }
            let newItem = {
                content: addData,
                color: color
            }
            setMydata(pre => {
                let newData = JSON.parse(JSON.stringify(pre))
                newData[query.group_I].items.length < 8 ? newData[query.group_I].items.push(newItem) : alert("Items can't be greater than Eight")
                localStorage.setItem("zino_tech_list_darg_drop_dp", JSON.stringify(newData))
                return newData
            })
            setModal(false)
            setAddData("")
            e.target.value = ""
            document.getElementById("form").reset()

        }

    }

    // update the content Editable data through handleBlur function
    const handleBlur = (e, query, value) => {
        let editedData = e.target.innerText.trim()
        if (editedData == value) {
            return
        }
        setMydata(pre => {
            let newData = JSON.parse(JSON.stringify(pre))
            newData[query.group_I].items[query.item_I].content = editedData
            localStorage.setItem("zino_tech_list_darg_drop_dp", JSON.stringify(newData))
            return newData
        })

    }

    // change modal state to open the Modal
    const handleModal = () => {
        setModal(false)
    }

    //Function to open Modal
    const handleOpen = (e, query) => {
        setModal(true)
        setGroup(query.group_I)
    }


    return (
        <div className="main">

            {
                myData && myData.map((e, group_I) => (
                    <div key={group_I}
                        onDragEnter={drag && !e.items.length ? (e) => handleDrag(e, { group_I, item_I: 0 }) : null} className="group">
                        <div className="title">{e.title}</div>
                        <div className='add'>
                        </div>
                        <div className='add' onClick={(e) => handleOpen(e, { group_I })}>+Add</div>
                        {modal && <div className='hide'>
                            <p className='cross2' onClick={handleModal}>x</p>
                            <form onSubmit={(e) => handleAdd(e, { group_I })} id="form">
                                <input type="text" placeholder='Enter text to Add' onChange={(e) => setAddData(e.target.value)} autoFocus autoComplete='false' />
                                <button onClick={(e) => handleAdd(e, { group_I })}>Add</button>
                            </form>
                        </div>}
                        {
                            e.items.map((item, item_I) => (
                                <div key={item_I} style={{ backgroundColor: drag ? myStyle({ group_I, item_I }, item.color) : item.color, color: drag ? myStyleColor({ group_I, item_I }, item.color) : "white" }} className='cross'>
                                    <p onClick={(e) => handleDelete(e, { group_I, item_I })}>x</p>
                                    <div
                                        key={item_I}
                                        draggable
                                        onDragStart={(e) => handleStart(e, { group_I, item_I })}
                                        onDragEnter={drag ? (e) => handleDrag(e, { group_I, item_I }) : null}
                                        className="item"
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) => handleBlur(e, { group_I, item_I }, item.content)}
                                        style={{ backgroundColor: drag ? myStyle({ group_I, item_I }, item.color) : item.color, color: drag ? myStyleColor({ group_I, item_I }, item.color) : "white" }}
                                    >
                                        {item.content}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                ))
            }
        </div >
    )
}

export default Drop