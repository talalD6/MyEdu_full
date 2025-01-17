import React, { useEffect, useState } from 'react'
// import 'boxicons'

import './sidebar.css'
import SidebarIcon from './SidebarIcon'
import { useLocation } from 'react-router-dom'

const AdminSidebar = () => {
    const [active, setActive] = useState('');

    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/') {
            setActive('home')
        } else if (location.pathname === '/admin/manageusers') {
            setActive('manage users')
        } else if (location.pathname === '/admin/managecourses') {
            setActive('manage courses')
        } else if (location.pathname === '/admin/dashboard') {
            setActive('analistic')
        }
    }, [location])


    return (
        <div className='sidebar'>
            {/* <SidebarIcon link={} icon={} description={} horizontal={}/> */}
            <SidebarIcon link={''} icon={'home-alt-2'} description={'home'} active={active} setActive={setActive} />
            {/* <SidebarIcon link={''} icon={'home-alt'} description={'home2'} active={active} setActive={setActive} /> */}
            <SidebarIcon link={'admin/manageusers'} icon={'group'} description={'manage users'} active={active} setActive={setActive} />
            {/* <SidebarIcon link={''} icon={'image'} description={'manage courses2'} active={active} setActive={setActive} /> */}
            <SidebarIcon link={'admin/managecourses'} icon={'play-circle'} description={'manage courses'} active={active} setActive={setActive} />
            <SidebarIcon link={'admin/dashboard'} icon={'bar-chart'} description={'analistic'} horizontal={'bx-flip-horizontal'} active={active} setActive={setActive} />
            {/* <SidebarIcon link={''} icon={'line-chart'} description={'analistic2'} active={active} setActive={setActive} /> */}
            {/* <SidebarIcon link={''} icon={'bar-chart-alt-2'} description={'analistic3'} horizontal={'bx-flip-horizontal'} active={active} setActive={setActive} /> */}

        </div>
    )
}

export default AdminSidebar