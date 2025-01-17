import React, { useContext, useState } from 'react'

import logo from "./../assets/icons/logo.svg"
import logotitle from "./../assets/icons/logoTitle.svg"
import cart from "./../assets/icons/cart.svg"
import searchicon from "./../assets/icons/searchicon.svg"

// import {AddCircleOutlineIcon} from '@mui/icons-material';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlineIcon';
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { Link, useNavigate } from 'react-router-dom'
import "./css/header.css"
import Dashbord from '../component/Dashbord'
import { message } from 'antd'
import axios from 'axios'

import { ShopContext } from '../Context/ShopContext'


function Header() {
  const { isTeacher, setTeacher,getCategories } = useContext(ShopContext);
  
  const category = getCategories();
  
  const navigate = useNavigate();
  // const { all_product, cartItems, addToCart, removeFromCart, getTotlaCartAmount } = useContext(ShopContext);


  const [openCategory, setOpenCategory] = useState(false);

  const addCourse = async () => {
    // console.log('Received values:', values.title);
    if (!localStorage.getItem('auth-token')) {
      message.info("please login first");
      navigate('/login')
    }
    try {
      fetch('http://localhost:5000/api/addcourse', {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json'
        },
        body: ''
      }).then(resp => resp.json()).then(data => data.course).then((course) => {
        navigate(`/teacher/addCourse/${course._id}`);
      });
      message.info("Complete all entry fields");
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    }
  };

  return (
    <nav className='fixed'>
      <div className='navmenu container'>

        <div>
          <Link to="/" >
            <div className='logo'>
              <img src={logo} />
              <img src={logotitle} />
            </div>
          </Link>
        </div>


        <div className="pages">
          <ul className='navLinks'>
            <li className='navLink'><Link to="/courses" ><button>Courses</button></Link></li>
            <li className='navLink' onClick={() => setOpenCategory(!openCategory)} onWheel={() => setOpenCategory(false)} >
              <button >Category</button>
              {/* <Link to="/Category" ><button>Category</button></Link> */}
              <div className={!openCategory ? '' : 'shooo'} onClick={() => setOpenCategory(false)} />
              <ul className={!openCategory ? 'hidden' : 'dropdown'} >

                {
                  category.map((item) => {
                    return (
                      <li key={item.id}>
                        <Link to={`/category/${item.name}`} onClick={() => setOpenCategory(false)}>
                          <button className='dropdownCategory'>{item.name}</button>
                        </Link>
                      </li>
                    )
                  })
                }
              </ul>
            </li>
          </ul>
        </div>


        <div className="search">
          <input className='search-input' type="text" placeholder='search for course' />
          <img src={searchicon} />
        </div>


        <div>
          <Link to="/cart" >
            <div className='cart'>
              <img src={cart} className='imgcart' />
              <div className='circle'>0</div>
            </div>
          </Link>
        </div>


        <div className='login'>

          {
            localStorage.getItem('auth-token') ?
              <>
                {
                  isTeacher ?
                    <button className='' onClick={addCourse}>Add course</button> :
                    // <Link to="/addCourse" ><button className='add-course' ><AddCircleOutlineIcon fontSize="large" /></button></Link>:
                    <button className='' onClick={() => setTeacher()}>Teach mode</button>
                  // <Link to="/" ><button className=''>Teach mode</button></Link>
                }
                <Dashbord />
              </> :
              <>
                <Link to="/login" ><button className='ghostbtn' onClick={() => message.warning('please login first')}>Teach mode</button></Link>
                <Link to="/login" ><button className='primarybtn'>Login</button></Link>
              </>
          }


          {/* {
    localStorage.getItem('auth-token') ?
      <button onClick={() => { localStorage.removeItem('auth-token'); window.location.replace('/') }}>Logout</button> :
      <Link to='/login'><button>Login</button></Link>
  } */}


        </div>

      </div>
    </nav>

  )
}

export default Header