import React, { useState } from 'react';
import './Accordion.css';
import arrow from '../../assets/icons/arrow.png'

const Accordion = ({ chapters, setPlayVideoUrl, showModal }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const WatchFreeChapters = (lesson, chapter) => {
        if (!chapter.isFree) {
            return;
        }
        // console.log(lesson);
        setPlayVideoUrl(lesson.videoUrl);
        showModal();
    }

    // const chapters = [
    //     {
    //         title: "Chapter 1: Introduction to Programming",
    //         lessons: ["Lesson 1: Basics of Programming", "Lesson 2: Variables and Data Types"]
    //     },
    //     {
    //         title: "Chapter 2: Control Structures",
    //         lessons: ["Lesson 1: Conditional Statements", "Lesson 2: Loops"]
    //     },
    //     {
    //         title: "Chapter 3: Functions and Modules",
    //         lessons: ["Lesson 1: Introduction to Functions", "Lesson 2: Creating and Using Modules"]
    //     },
    //     {
    //         title: "Chapter 2: Control Structures",
    //         lessons: ["Lesson 1: Conditional Statements", "Lesson 2: Loops"]
    //     },
    //     {
    //         title: "Chapter 2: Control Structures",
    //         lessons: ["Lesson 1: Conditional Statements", "Lesson 2: Loops"]
    //     },
    //     {
    //         title: "Chapter 2: Control Structures",
    //         lessons: ["Lesson 1: Conditional Statements", "Lesson 2: Loops"]
    //     },
    //     {
    //         title: "Chapter 2: Control Structures",
    //         lessons: ["Lesson 1: Conditional Statements", "Lesson 2: Loops"]
    //     }
    // ];

    return (

        <div className="accordion">

            {chapters.map((chapter, index) => (
                <div className="panel" key={index}>
                    <div className="panel-heading" onClick={() => toggleAccordion(index)}>
                        <h4 className="panel-title">chapter {index + 1} : {chapter.title}</h4><div className='arrow'><img src={arrow} /></div>
                    </div>
                    {activeIndex === index && (
                        <div className="panel-content">
                            {chapter.lessons.map((lesson, lessonIndex) => (
                                <p onClick={() => WatchFreeChapters(lesson, chapter)} className={`${chapter.isFree && 'green cursor'}`} key={lessonIndex}>{lesson.title}</p>
                            ))}
                        </div>
                    )}
                </div>
            ))}

        </div>
    );
};

export default Accordion;
