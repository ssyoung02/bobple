import React, { useEffect, useState, useRef } from 'react';
import '../../assets/style/components/Header.css';
import { faCartShopping, faMagnifyingGlass, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "../../assets/images/bobple_logo.png";
import mascot from '../../assets/images/bobple_mascot.png';
import { clearRecipeLocalStorage } from '../../utils/localStorageUtils';
import axios from 'axios';

function Header({ theme, toggleTheme }) {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0); // 안 읽은 메시지 개수 상태 추가
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    const moveSearch = () => {
        clearRecipeLocalStorage();
        navigate('/search');
    };

    const handleLinkClick = (path) => {
        clearRecipeLocalStorage();
        navigate(path);
        window.location.reload(); // 페이지 새로고침
    };

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("No token found, please log in");
                return;
            }

            const response = await axios.get('http://localhost:8080/api/notifications', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setNotifications(response.data);
            setUnreadCount(response.data.filter(notif => !notif.read).length);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    const fetchUnreadMessagesCount = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userIdx');
            if (!token || !userId) {
                console.error("No token or userId found, please log in");
                return;
            }

            const response = await axios.get(`http://localhost:8080/api/messages/unread-count`, {
                params: { userId: userId },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUnreadMessagesCount(response.data);  // 숫자 값 자체를 상태로 설정
            console.log("Total unread messages count:", response.data);
        } catch (error) {
            console.error("Failed to fetch unread messages count", error);
        }
    };

    const handleNotificationClick = async (notificationId, recipeId) => {
        if (notificationId === 'unread-messages') {
            navigate('/group');
            // 안읽은 메시지 알림을 클릭했을 때, 해당 알림을 제거
            setUnreadMessagesCount(0);
            setShowNotifications(false);  // 모달 닫기
        } else {
            navigate(`/recipe/${recipeId}`);

            try {
                await axios.delete(`http://localhost:8080/api/notifications/${notificationId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                setNotifications(notifications.filter(notification => notification.id !== notificationId));
                setUnreadCount(unreadCount - 1);
                setShowNotifications(false);  // 모달 닫기
            } catch (error) {
                console.error("Failed to delete notification", error);
            }
        }
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');

            await axios.delete('http://localhost:8080/api/notifications', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setNotifications([]);
            setUnreadCount(0);
            setUnreadMessagesCount(0); // 모든 알림 읽음 처리 시, 메시지 알림도 0으로

        } catch (error) {
            console.error("Failed to delete notifications", error);
        }
    };


    useEffect(() => {
        fetchUnreadMessagesCount().then(fetchNotifications); // 안 읽은 메시지 개수 가져온 후 알림 가져오기

        const eventSource = new EventSource('http://localhost:8080/api/notifications/stream');
        eventSource.onmessage = (event) => {
            const newNotification = JSON.parse(event.data);
            setNotifications((prev) => [newNotification, ...prev]);
            setUnreadCount((prev) => prev + 1);
        };

        return () => {
            eventSource.close();
        };
    }, []);

    // 모달 외부 클릭 감지 핸들러
    const handleClickOutside = (event) => {
        if (notificationRef.current && !notificationRef.current.contains(event.target)) {
            setShowNotifications(false);
        }
    };

    useEffect(() => {
        if (showNotifications) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showNotifications]);

    return (
        <div className="header">
            <Link to="/" className="headerLogo" onClick={() => handleLinkClick('/')}>
                <img src={logoImg} alt="bobple로고" />
            </Link>
            <div className="header-Buttons">
                <label className="theme-checkbox-label">
                    <input type="checkbox" className="theme-checkbox" onClick={toggleTheme}/>
                    <span className="theme-slider"></span>
                </label>
                {/*<Link to="/point" className="headerLink" onClick={() => handleLinkClick('/point')}>*/}
                {/*    <FontAwesomeIcon icon={faCartShopping} />*/}
                {/*</Link>*/}
                <div className="notification-wrapper" ref={notificationRef}>
                    <button type={"button"} className={"headerLink"} onClick={toggleNotifications}>
                        <FontAwesomeIcon icon={faBell}/>
                        {(unreadCount > 0 || unreadMessagesCount > 0) && (
                            <span
                                className="notification-badge">{unreadCount + (unreadMessagesCount > 0 ? 1 : 0)}</span>
                        )}
                    </button>
                    {showNotifications && (
                        <div className="notification-dropdown">
                            <div className="notification-header">
                                <h5>알림</h5>
                                <button className="mark-all-read" onClick={markAllAsRead}>
                                    모두 읽음 처리
                                </button>
                            </div>
                            <div className="notification-list">
                                {notifications.length > 0 || unreadMessagesCount > 0 ? (
                                    <>
                                        {notifications.map((notification, index) => (
                                            <div
                                                key={index}
                                                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                                                onClick={() => handleNotificationClick(notification.id, notification.recipeId)}
                                            >
                                                {/*<img src={mascot} alt="밥풀이"/>*/}
                                                <div className="notification-message">{notification.message}</div>
                                            </div>
                                        ))}
                                        {unreadMessagesCount > 0 && (
                                            <div
                                                className="notification-item unread"
                                                onClick={() => handleNotificationClick('unread-messages')}
                                            >
                                                {/*<img src={mascot} alt="밥풀이"/>*/}
                                                <div className="notification-message">안읽은 메시지가 {unreadMessagesCount}개 있습니다.</div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="notification-item">알림이 없습니다.</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <button type={"button"} className={"headerLink"} onClick={moveSearch}>
                    <FontAwesomeIcon icon={faMagnifyingGlass}/>
                </button>
            </div>
        </div>
    );
}

export default Header;
