import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://safway.io" target="_blank" rel="noopener noreferrer">
          Safeway 
        </a>
        <span className="ms-1">&copy; 2023</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://safway.io" target="_blank" rel="noopener noreferrer">
          Safeway
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
