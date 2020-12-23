import React from "react";
import { GoogleLogin } from "react-google-login";

const responseGoogle = (props) => {
    const onResponse = (response) => {
        const user = {
            ...response.profileObj,
            password: response.profileObj?.googleId,
        };
        props.socket.emit('signUp', user)
    };
    return (
        <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLEID}
            buttonText="Signup"
            onSuccess={onResponse}
            onFailure={onResponse}
            cookiePolicy={"single_host_origin"}
        />
    );
};

export default responseGoogle;
