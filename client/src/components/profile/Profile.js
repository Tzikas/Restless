import React, { Component, useEffect } from 'react';
import TheContext from '../../TheContext'



const Profile = (props) => {

    //With Context I can skip the prop drilling and access the context directly 
    const { user, setUser, history, socket } = React.useContext(TheContext);

    const editName = (e) => {
        console.log(e, e.target.value, e.target.innerText)

    }

    return (
        <div>
            <i>Profile</i>
            <ul>
                <li>
                    name : <span onBlur={editName}>{user?.name}</span>
                </li>
            </ul>
        </div >
    )
}

export default Profile;