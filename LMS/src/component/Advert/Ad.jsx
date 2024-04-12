import React from 'react'
import photo from "../../assets/images/AD.png"
import "./ad.css"

function Ad() {
  return (
    
     <div className='ad'>
     <div className='ad-container'>
        <img src={photo} />
        <div className='text_container'>
            <h2>The number one factor in <br/><span> relevance drives out resistance.</span></h2>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<br/>
             Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            
        </div>
     </div>
     </div>
    
  )
}

export default Ad