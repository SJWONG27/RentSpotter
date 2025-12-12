import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom'

const ShowNavbar = ({children}) => {

    const location = useLocation();
    const [showNavbar, setShowNavbar] = useState(false)

    useEffect(() => {
            console.log('this is location: ', location)
            if(location.pathname === '/signIn'){
                setShowNavbar(false)
            }
            else{
                setShowNavbar(true)
            }
    },[location])
    
    return(
        <div>{children}</div>
    )
}
export default ShowNavbar;