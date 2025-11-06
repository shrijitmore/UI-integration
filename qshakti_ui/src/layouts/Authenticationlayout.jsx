import React, { Fragment } from 'react'
import { Outlet } from 'react-router-dom'
import AuthSwitcher from './AuthSwitcher';



function Authenticationlayout () {
  document.body.classList.add('bg-account')
  return (
    <Fragment>
    
     <AuthSwitcher/>
      <div className="page h-100">
          <Outlet />  

      </div>

    </Fragment>

  )
}

export default Authenticationlayout;
