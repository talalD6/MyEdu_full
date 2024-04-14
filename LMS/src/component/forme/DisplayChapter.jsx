import * as React from "react";
import { useMotionValue, Reorder, useDragControls } from "framer-motion";
import { ReorderIcon } from "./Icon";
import { Switch } from "antd";
import EditIcon from '@mui/icons-material/Edit';
import { Link, useParams } from "react-router-dom";
import Course from "../../Pages/Course";
// import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';


export const DisplayChapter = ({ chaptre, index }) => {
    const { courseId } = useParams();

    const y = useMotionValue(0);
    //   const boxShadow = useRaisedShadow(y);
    const dragControls = useDragControls();

    // console.log(chaptre.lessons.length);
    const border = chaptre.lessons.length > 0 ? '' : 'borderError'; 

    return (
        <Reorder.Item
            value={chaptre}
            id={chaptre}
            style={{ y }}
            dragListener={false}
            dragControls={dragControls}
        >
            <div className={`chapter-card ${!chaptre.isFree && 'notfree'} ${border}`}>

                <div className="info-card">
                    <ReorderIcon className='cursordrag' dragControls={dragControls} />
                    <span className="card-chapterTitle">{index} - {chaptre.title}</span>
                </div>
                <div className="info-card">

                    {/* <Switch
                        className='custom-switch switch'
                        // style={{ transform: [{ scaleX: 15 }, { scaleY: 15 }] }}
                        // size="large"
                        checkedChildren={'free'}
                        unCheckedChildren={'closed'}
                        defaultChecked
                        // defaultChecked={chaptre.isFree}
                    /> */}
                    <Link to={`/teacher/addCourse/${courseId}/chapters/` + chaptre._id}>
                        <EditIcon className='cursor' style={{ color: 'rgb(13, 138, 160)' }} />
                    </Link>
                </div>
            </div>

        </Reorder.Item>
    );
};
