import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import '../../assets/style/myPage/MyPageMain.css';
import {Bookmark, Calculator, DefaultUser, Exclamation, FilePen, Heart, NextTo, Notice, Question} from "../../components/imgcomponents/ImgComponents"; // 상대 경로로 수정


function MyPageMain() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        birthdate: '',
        nickName: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            const userIdx = localStorage.getItem("userIdx");

            if (token && userIdx) {
                try {
                    const response = await axios.get(`http://localhost:8080/api/users/${userIdx}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    const userData = response.data;
                    setUser(userData);
                    setFormData({
                        birthdate: userData.birthdate || '',
                        nickName: userData.nickName || ''
                    });
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    navigate("/myPage/login");
                }
            } else {
                navigate("");
            }
        };

        fetchUserData();
    }, [navigate]);

    const moveLogin = () => {
        navigate('/myPage/login');
    };

    const moveUserModify = () => {
        navigate('/myPage/userModify');
    };

    const moveMyPointUsage = () => {
        navigate('/myPage/myPointUseage');
    };

    const moveCalculator = () => {
        navigate('/myPage/calculator');
    };

    const movePointShop = () => {
        navigate('/point', { state: { selectedTab: '보관함' } });
    };

    const moveMyRecipe = () => {
        navigate('/myPage/myRecipe')
    }

    const moveLikeRecipe = () => {
        navigate('/myPage/MylikeRecipe')
    }

    const moveBookMark = () => {
        navigate('/myPage/bookmark')
    }

    const moveMyReviews = () => {
        navigate('/myPage/myReviews')
    }
    const moveNotice = () => {
        navigate('/mypage/serviceCenter/userNotice')
    }

    const moveUserFAQ = () => {
        navigate('/mypage/serviceCenter/userFAQ')
    }

    const moveUserQnA = () => {
        navigate('/mypage/serviceCenter/userQnAList')
    }

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="my-page-main">
            <div className="user-info">
                {user ? (
                    <>
                        <button className="goto-UserModify" onClick={moveUserModify}>
                            <div className="mypage-profile">
                                <img src={user.profileImage} alt="Profile" className="mypage-profile-image"/>
                            </div>
                            <div className="mypage-nickname">
                                <span>{user.nickName}</span>
                                <NextTo/>
                            </div>
                        </button>
                        <button className="goto-MyPointUsage" onClick={moveMyPointUsage}>
                            {user.point}P
                            <NextTo/>
                        </button>
                    </>
                ) : (
                    <button className="goto-UserModify" onClick={moveLogin}>
                        <div className="mypage-profile before-login">
                            <DefaultUser/>
                        </div>
                        <div className="mypage-nickname">
                            <span>로그인</span>
                            <NextTo/>
                        </div>
                    </button>
                )}
            </div>
            <button className="goto-Calculator" onClick={moveCalculator}>
                <span>지금 당장 1/N이 필요하다면?</span>
                <Calculator/>
            </button>

            {user &&
            <>
                <div className="my-activities">
                    <h5>내 활동</h5>
                    <button className="mypage-link" onClick={moveMyRecipe}>
                        <span className="activites-icon">
                            <FilePen/>
                        </span>
                        <h6>작성한 레시피</h6>
                    </button>
                    <button className="mypage-link" onClick={moveLikeRecipe}>
                        <span className="activites-icon">
                            <Heart/>
                        </span>
                        <h6>좋아요 레시피</h6>
                    </button>
                    <button className="mypage-link" onClick={moveBookMark}>
                        <span className="activites-icon">
                            <Bookmark/>
                        </span>
                        <h6>북마크 음식점</h6>
                    </button>
                    <button className="mypage-link" onClick={moveMyReviews}> {/* 새로운 버튼 추가 */}
                        <span className="activites-icon">
                            <FilePen/>
                        </span>
                        <h6>작성한 리뷰</h6>
                    </button>
                </div>
                <div className="mypag-point">
                    <button className="goto-PointShop" onClick={movePointShop}>
                        <h5>포인트 구매내역</h5>
                        <NextTo/>
                    </button>
                    <div className="mypage-products">



                    </div>
                </div>
            </>
            }

            <div className="service-center">
                <h5>고객센터</h5>
                <button className="mypage-link" onClick={moveNotice}>
                    <span className="activites-icon">
                        <Notice/>
                    </span>
                    <h6>공지사항</h6>
                </button>
                <button className="mypage-link" onClick={moveUserFAQ}>
                    <span className="activites-icon circle-icon">
                        <Exclamation/>
                    </span>
                    <h6>자주 묻는 질문</h6>
                </button>
                <button className="mypage-link" onClick={moveUserQnA}>
                    <span className="activites-icon circle-icon">
                        <Question/>
                    </span>
                    <h6>문의하기</h6>
                </button>
            </div>
            {user ?
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
                :
                <></>
            }
        </div>
    );
}

export default MyPageMain;
