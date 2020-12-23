import React from "react";
import socket from "../../api/index";
import { GoogleLogin } from "react-google-login";
import TheContext from '../../TheContext'

const responseGoogle = (props) => {

    const onResponse = (response) => {
        console.log(response);
        const user = {
            ...response.profileObj,
            password: response.profileObj?.googleId,
        };
        props.socket.emit('logIn', user)
    };
    return (
        <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLEID}
            buttonText="Login"
            onSuccess={onResponse}
            onFailure={onResponse}
            cookiePolicy={"single_host_origin"}
        />
    );
};

export default responseGoogle;
