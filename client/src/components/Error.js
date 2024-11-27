//22031515D Fok Luk Hang
//22026938D Poon Cheuk Kit
import React from 'react';

function Error({message}) {
    return (
        <div>
            <div class="alert alert-danger" role="alert">
                {message}
            </div>
        </div>
    )
}

export default Error;