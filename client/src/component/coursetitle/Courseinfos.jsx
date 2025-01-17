import React from 'react'
import './courseinfos.css'
import lectur from '../../assets/icons/chapters.png'
import clock from '../../assets/icons/clock.png'
import Accordion from './Accordion'

function Courseinfos(props) {

  return (
    <div className='cr'>

      <div className='course-bigdescription'>
        <h3><span>About</span> course</h3>
        <p>{props.bigdescription}</p>
      </div>

      <div className='lessons'>
        <h3><span>Circuluim </span>Course</h3>
        <div className='Circuluim'>
          <div className='lectures'><img src={lectur} /><h5>{props.chapters?.length} number of chapters</h5></div>
          <div className='clock'><img src={clock} /><h5>duration</h5></div>
        </div> 
        <div>
          {
            props.chapters &&
            <Accordion chapters={props.chapters} setPlayVideoUrl={props.setPlayVideoUrl} showModal={props.showModal} />
          }
        </div>
      </div>

      <div className='coursecomments'>
        <h3><span>Reviews</span></h3>
      </div>

    </div>
  )
}

export default Courseinfos