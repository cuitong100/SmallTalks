import React, { useEffect, useState } from "react";
import { createNewTalk, deleteTalk, getLikesById, likeButtonClickedFor, updateTalk } from "./common";
import { Link } from "react-router-dom";

// options for cardType : ["home", "detail", "like", "create"];

export default function TalkCard({ talk, cardType, submitCallBack, userId, setToUpdate, isLoggedin }) {
    
    const {title, content, likes, id, createdAt} = talk;

    const [ newTopic, setNewTopic ] = useState(title);
    const [ newContent, setNewContent ] = useState("");
    const [ newLikes, setNewLikes ] = useState(likes);

    const [isReadOnly, setIsReadOnly] = useState(false);
    const [showLabel, setShowLabel] = useState(false);
    const [showCreateTime, setShowCreateTime] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [showLike, setShowLike] = useState(false);
    const [showUpDel, setShowUpDel] = useState(false);
    const [showSubmit, setShowSubmit] = useState(false);
    const [hasPlaceholder, setHasPlaceholder] = useState(false);

    useEffect(() => {
        setNewContent(content);
    }, []);

    useEffect(() => {
        switch (cardType) {
            case "detail":
                setIsReadOnly(true);
                setShowLabel(true);
                setShowCreateTime(true);
                setShowLike(isLoggedin);
                break;
            case "like":
                setIsReadOnly(true);
                setShowMore(true);
                break;
            case "create":
                setShowLabel(true);
                setShowSubmit(isLoggedin);
                setHasPlaceholder(true);
                break;
            case "home":
            default:
                setIsReadOnly(!isLoggedin);
                setShowMore(true);
                setShowLike(isLoggedin);
                setShowUpDel(isLoggedin);
                break;
        }
    }, [ cardType, isLoggedin ]);

    const onSubmit = function subMit(_) {
        if (!newTopic || !newContent) {
            alert("Title and content cannot be empty.");
            return;
        }

        createNewTalk({
            title: newTopic,
            content: newContent,
            authorId: userId,
            callback: () => {
                if (submitCallBack) {
                    submitCallBack();
                }
            }
        });
    };

    const onUpdate = async function upd(_) {
        if (!newTopic || !newContent) {
            alert("Title and content cannot be empty.");
            return;
        }

        await updateTalk({
            title: newTopic,
            content: newContent,
            recordId: id
        });
        alert("Talk card has been updated!");
        setToUpdate(old => !old);
    };
    const onDelete = async function del(_) {
        await deleteTalk({
            recordId: id
        });
        alert("Talk card has been deleted!");
        setToUpdate(old => !old);
        window.location.replace('/');
    };

    const onLikeClicked = async function liKe(_) {
        await likeButtonClickedFor({
            userId: userId,
            recordId: id
        });
        const newLikesNumber = await getLikesById({recordId: id});
        setNewLikes(newLikesNumber);
    };

    const adjustSize = function sz(event) {
        const textareaComp = event.target;
        textareaComp.style.height = "1px";
        textareaComp.style.height = event.target.scrollHeight + "px";
    }

    const onTextAdjust = function ad(event) {
        const textareaComp = event.target;
        setNewContent(textareaComp.value);
        adjustSize(event);
    };

    return (
        <div className="card">
            {
                showLabel && <p className="card-topic">Title:</p>
            }
            <div className="card-header">
                <textarea 
                    readOnly={isReadOnly}
                    value={newTopic}
                    type="text"
                    rows={1}
                    className="card-topic"
                    onChange={(event) => {
                        setNewTopic(event.target.value);
                    }}
                    placeholder={hasPlaceholder ? "Please input title" : ""}
                >
                </textarea>
            </div>
            {
                showLabel && <p className="card-topic">Content:</p>
            }
            <div className="card-body">
            {
                isReadOnly ? (
                    <div className="card-content">
                        {`${newContent}`
                        }
                    </div>
                ) : (
                    <textarea 
                        readOnly={isReadOnly}
                        value={newContent}
                        type="text"
                        className="card-content"
                        rows={5}
                        onInput={(event) => {
                            onTextAdjust(event);
                        }}
                        onClick={(event) => {
                            adjustSize(event);
                        }}
                        placeholder={hasPlaceholder ? "Please input content" : ""}
                    >
                    </textarea>
                )
            }   
            </div>
            <div className="card-footer">
                {
                    showCreateTime && 
                    <div className="card-topic">
                        <p>
                            Created Time:  {createdAt}
                        </p>
                    </div>
                }
                <div className="card-like-star">
                    {
                        showLike && 
                        <button 
                            className="like-btn"
                            onClick={onLikeClicked}
                        >
                            {newLikes} &#x1F44D;
                        </button>
                    }
                    {
                        showMore &&
                        <Link to={`/details/${id}`}>
                            <button className="like-btn"
                            >
                                Read More
                            </button>
                        </Link>
                    }
                    {
                        showSubmit &&
                        <button className="like-btn" onClick={onSubmit}>
                            Submit
                        </button>
                    }
                    {
                        showUpDel &&
                        <>
                            <button className="like-btn" onClick={onDelete}>
                                Delete
                            </button>
                            <button className="like-btn" onClick={onUpdate}>
                                Update
                            </button>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}