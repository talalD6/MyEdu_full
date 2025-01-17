import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { Link, useNavigate, useParams } from "react-router-dom";
import { ThreeDots } from 'react-loader-spinner'
import ChaptresFormDisplay from '../chaptre-form-display/ChaptresFormDisplay';
import LinearWithValueLabel from '../LinearWithValueLabel';
import { Button, Form, Input, message, Modal, Popconfirm, Switch } from 'antd';
import confirm from 'antd/es/modal/confirm';

import { ExclamationCircleOutlined } from '@ant-design/icons';

const AddChapter = ({ role }) => {

    const navigate = useNavigate();

    useEffect(() => {
        if (role && role === 'user') {
            navigate('/');
        }
    }, [role, navigate]);
    // console.log(courseChaptres);

    const { courseId, chapterId } = useParams();
    // var title;

    const [title, setTilte] = useState('');

    const [img, setImg] = useState(null);
    const [progress, setProgress] = useState(0);
    const [video, setVideo] = useState(null);
    // const [videoUrl, setVideoUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [canAded, setCanAded] = useState(false);
    const [lessonDetails, setLessonDetails] = useState({
        title: '',
        videoUrl: '',
    })
    const [videoSrc, setVideoSrc] = useState(null)
    const videoRef = useRef(null)


    // const [chapter, setChapter] = useState([]);
    const [courseChaptres, setCourseChaptre] = useState([]);
    const [lessons, setLessons] = useState([]);



    useEffect(() => {
        const fetchChapter = async () => {
            try {
                // console.log(chapterId);
                const response = await axios.get(`http://localhost:5000/api/chapter/${chapterId}`);
                const { data } = response;
                // console.log(data.chapter.title);
                setCourseChaptre(data.chapter);
                setLessons(data.chapter.lessons);
            } catch (error) {
                console.error('Error fetching chapter:', error);
                // Handle error if needed
            }
        };

        fetchChapter();

        return () => {
            // Cleanup logic if needed
        };
    }, [chapterId]);


    const changeLessonHandler = (e) => {
        setLessonDetails({
            ...lessonDetails,
            [e.target.name]: e.target.value
        })
    }

    const uploadFile = async (type) => {
        const data = new FormData();
        data.append("file", type === 'image' ? img : video);
        data.append("upload_preset", type === 'image' ? 'images_preset' : 'videos_preset');

        try {
            let cloudName = import.meta.env.VITE_REACT_APP_CLOUDINARY_CLOUD_NAME;
            let resourceType = type === 'image' ? 'image' : 'video';
            let config = {
                onUploadProgress: (e) => {
                    const { loaded, total } = e
                    setProgress(Math.round((loaded / total) * 100))
                }
            }
            let api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

            const res = await axios.post(api, data, config);
            const { secure_url } = res.data;
            // console.log(secure_url);
            return secure_url;
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const existingObj = lessons.find(lesson => lesson.title === lessonDetails.title);

            // If an object with the same title exists, don't add it again
            if (existingObj) {
                message.warning(`lesson with title '${lessonDetails.title}' already exists in the lessons.`);
            } else {

                // Upload video file
                const videoUrl = await uploadFile('video');
                // setVideoUrl(videoUrl);

                // setLessonDetails(prev => ({
                //     title: prev.title,
                //     videoUrl: videoUrl,
                // }))

                setLessons(
                    [
                        ...lessons,
                        {
                            title: lessonDetails.title,
                            videoUrl: videoUrl
                        }
                    ]
                )

                // Send backend api request
                // await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/videos`, { imgUrl, videoUrl });

                // Reset states 
                // setVideo(null);

                // console.log("File upload success!");
                setLoading(false);
                setCanAded(true);


                message.success('chapter added successfully')
            }

        } catch (error) {
            console.error(error);
        }
    }

    const addLesson = () => {

        // Check if an object with the same title already exists in the array
        const existingObj = lessons.find(lesson => lesson.title === lessonDetails.title);

        // If an object with the same title exists, don't add it again
        if (existingObj) {
            message.warning(`lesson with title '${lessonDetails.title}' already exists in the lessons.`)
        } else {
            setLessons(
                [
                    ...lessons,
                    {
                        title: lessonDetails.title,
                        videoUrl: lessonDetails.videoUrl
                    }
                ]
            )
            message.success('chapter added successfully')
        }

    }

    const deleteLesson = (index) => {
        if (index > -1) {
            setLessons((prevChapter) =>
                prevChapter.filter((_, i) => i !== index)
            );
        }
    }

    useEffect(() => {
        const src = URL.createObjectURL(new Blob([video], { type: 'video/mp4' }))
        setVideoSrc(src)
    }, [video])

    const onFinish = async (values) => {
        // console.log(values);

        if (lessons.length < 1) {
            message.warning('Please add at least one lesson');
            return;
        }

        const title = values.title ? values.title : courseChaptres.title

        let chaptreDetails = {
            id: chapterId,
            title: title,
            isFree: values.isFree,
            lessons: lessons,
        }

        try {
            const response = await axios.post(`http://localhost:5000/api/addchapterdetails`, chaptreDetails);
            const { data } = response;
            // setCourse(data.course);

            // Extract chapters from the course object and update the chapters state
            if (data.success) {
                message.success('chapter added successfully');
                navigate(`/teacher/addCourse/${courseId}`);
            }
        } catch (error) {
            message.error('chapter added failed');
        }

        // console.log(chaptreDetails);

    };


    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = async () => {
        setIsModalOpen(false);
        try {
            const response = await axios.delete(`http://localhost:5000/api/courses/${courseId}/chapters/${chapterId}`);
            const { data } = response;

            if (data.success) {
                message.success('chapter deleted successfully');
                // Navigate(`/teacher/addCourse/${courseId}`);
                navigate(`/teacher/addCourse/${courseId}`);
            }
        } catch (error) {
            message.error('chapter deleted failed');
            // Handle error if needed
        }
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [isModalOpenClose, setIsModalOpenClose] = useState(false);


    const showModalClose = () => {
        setIsModalOpenClose(true);
    };

    const handleOkClose = () => {
        navigate(`/teacher/addCourse/${courseId}`);
        setIsModalOpenClose(false);
    }

    const handleCancelClose = () => {
        setIsModalOpenClose(false);
    };




    return (

        <section className='section'>
            <div className="container">
                <div className='flex '>
                    {/* <Link  to={`/teacher/addCourse/${courseId}`}>Back to Course</Link> */}
                    <button onClick={showModalClose} className='back-btn'>Back to Course</button>
                    <p></p>
                    <Modal
                        open={isModalOpenClose}
                        title="save your chapter"
                        onOk={handleOkClose}
                        onCancel={handleCancelClose}
                        footer={[
                            <Button key="submit" type="link" onClick={handleOkClose}>
                                dont save
                            </Button>,
                            <Button form="yourForm" key="submit" htmlType="submit" type='primary' onClick={handleCancelClose}>
                                Save
                            </Button>,
                            // <Button key="submit" type="primary" onClick={handleOkClose}>
                            //     i know
                            // </Button>
                        ]}>
                        <div className=''>
                            <p>please save your chapter, or you will lose the last edits you made</p>
                        </div>
                    </Modal>
                    <div className='btn-container'>

                        <Button className='ml' type='text' onClick={showModal} >
                            Delete
                        </Button>

                        <Modal title="Are you sure to delete this chapter ?" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                            <p>this chapter will be permanently deleted along with its lessons</p>
                        </Modal>

                        <Button form="yourForm" key="submit" htmlType="submit" type='primary'>
                            Save
                        </Button>
                    </div>
                </div>


                < div className='grid mt' >

                    <div className='card'>
                        <h2 className='addcourse-subtitle'>Customize your chapter</h2>

                        {
                            courseChaptres?.title && (

                                <Form
                                    name="yourForm"
                                    layout="inline"
                                    onFinish={onFinish}
                                    style={{ justifyContent: "start", gap: '5%' }}
                                    initialValues={{
                                        title: courseChaptres?.title,
                                        isFree: courseChaptres?.isFree,
                                    }}
                                >
                                    <p className='filed-title mt'>Chapter title</p>
                                    <Form.Item
                                        style={{ width: "100%", marginBottom: 10, marginTop: 10, marginRight: 0, marginLeft: 0 }}
                                        name='title'
                                    >
                                        <Input placeholder="chapter title" />
                                    </Form.Item>

                                    <p className='filed-title mt'>Chapter is Free</p>
                                    <Form.Item
                                        name='isFree'
                                        style={{ marginTop: 12, marginRight: 0, marginLeft: 0 }}
                                    // valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>
                                </Form>

                            )
                        }


                    </div>

                    <div className='card'>
                        <h2 className='addcourse-subtitle'>Customize your lessons</h2>
                        <div>

                            <div className="add-chapitre">
                                <div className='flex'>
                                    <p className='filed-title'>lesson title and video</p>
                                    <div className='flex'>
                                        <div className='btn-disable-div'>
                                            {(loading || !!!video || !!!lessonDetails.title) &&
                                                <div className='btn-disable' />
                                            }
                                            <button className='add-chapitre-btn' type='button' onClick={handleSubmit}>Add</button>
                                        </div>
                                        {/* <div className='ml btn-disable-div'>
                                            {(!canAded || loading || !!!video) &&
                                                <div className='btn-disable' />
                                            }
                                            <button className='add-chapitre-btn' type='button' onClick={addLesson}>Save</button>
                                        </div> */}

                                    </div>
                                </div>
                                <div className="addCourse-itemfield">
                                    <LinearWithValueLabel progress={progress} />
                                    <input value={lessonDetails.title} onChange={changeLessonHandler} type="text" name='title' placeholder="e.g 'The Complete 2024 Web Development Bootcamp'" />
                                    {/* {error.title && <p className='filed-error'>title is missing</p>} */}
                                </div>

                                <div className="image-input">
                                    <input onChange={(e) => setVideo((prev) => e.target.files[0])} type="file" accept='video/*' name="video" id="video" />
                                    <video
                                        className='videoChaptre'
                                        controls
                                        ref={videoRef}
                                        src={videoSrc}
                                        width={'100%'}
                                        height={'280px'}
                                    ></video>
                                </div>
                            </div>

                            <div className="line" />

                            <p className='filed-title'>Uploaded lessons</p>

                            {/* <ChaptresFormDisplay courseChaptres={courseChaptres.lessons} setCourseChaptre={setCourseChaptre} deleteChapter={deleteChapter} /> */}
                            <ChaptresFormDisplay lessons={lessons} setLessons={setLessons} deleteLesson={deleteLesson} />

                        </div>
                    </div>

                </div >
            </div>
        </section>

    )
}

export default AddChapter





// <div className='grid mt'>

// <div className='card'>
//     <h2 className='addcourse-subtitle'>Customize your chapter</h2>


//     {
//         courseChaptres?.title && (

//             <Form
//                 name="yourForm"
//                 layout="inline"
//                 onFinish={onFinish}
//                 style={{ justifyContent: "start", gap: '5%' }}
//                 initialValues={{
//                     title: courseChaptres?.title,
//                     isFree: courseChaptres?.isFree,
//                 }}
//             >
//                 <p className='filed-title mt'>Chapter is Free</p>
//                 <Form.Item
//                     name='isFree'
//                     style={{ marginTop: 12, marginRight: 0, marginLeft: 0 }}
//                 // valuePropName="checked"
//                 >
//                     <Switch />
//                 </Form.Item>
//                 {/* <p className='filed-title mt'>Chapter title</p> */}
//                 <Form.Item
//                     style={{ width: "100%", marginBottom: 10, marginTop: 10, marginRight: 0, marginLeft: 0 }}
//                     name='title'
//                 >
//                     <Input placeholder="chapter title" />
//                 </Form.Item>

//             </Form>

//         )
//     }

//     <h2 className='addcourse-subtitle'>Customize your lessons</h2>

//     <div className="add-chapitre">
//         <div className='flex'>
//             <p className='filed-title'>lesson title and video</p>
//             <div className='flex'>
//                 <div className='btn-disable-div'>
//                     {(loading || !!!video || !!!lessonDetails.title) &&
//                         <div className='btn-disable' />
//                     }
//                     <button className='add-chapitre-btn' type='button' onClick={handleSubmit}>Add</button>
//                 </div>
//                 <div className='ml btn-disable-div'>
//                     {(!canAded || loading || !!!video) &&
//                         <div className='btn-disable' />
//                     }
//                     <button className='add-chapitre-btn' type='button' onClick={addLesson}>Save</button>
//                 </div>

//             </div>
//         </div>
//         <div className="addCourse-itemfield">
//             <LinearWithValueLabel progress={progress} />
//             <input value={lessonDetails.title} onChange={changeLessonHandler} type="text" name='title' placeholder="e.g 'The Complete 2024 Web Development Bootcamp'" />
//             {/* {error.title && <p className='filed-error'>title is missing</p>} */}
//         </div>

//         <div className="image-input">
//             <input onChange={(e) => setVideo((prev) => e.target.files[0])} type="file" accept='video/*' name="video" id="video" />
//             <video
//                 className='videoChaptre'
//                 controls
//                 ref={videoRef}
//                 src={videoSrc}
//                 width={'100%'}
//                 height={'280px'}
//             ></video>
//         </div>
//     </div>

// </div>

// <div className='card'>


//     <p className='filed-title'>Uploaded lessons</p>

//     {/* <ChaptresFormDisplay courseChaptres={courseChaptres.lessons} setCourseChaptre={setCourseChaptre} deleteChapter={deleteChapter} /> */}
//     <ChaptresFormDisplay lessons={lessons} setLessons={setLessons} deleteLesson={deleteLesson} />

// </div>
// </div>




