import '../../assets/style/components/GroupModal.css';
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";

// props로 받은 제목, 내용을 출력하는 모달
const GroupModal = ({ modalState, hideModal }) => {
    const navigate = useNavigate();

    const moveChat = () => {
        navigate('../chatting');
    };

    const closeModal = () => {
        hideModal();
    }

    return (
        <div className={`modal ${modalState}`}>
            <div className="modal-content">
                <div className="group-modal-header">
                    <button className="group-modal-close-btn" onClick={closeModal}>×</button>
                    <h3 className="group-modal-title">모임 만들기</h3>
                    <button className="group-modal-create-btn" onClick={moveChat}>생성</button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label>모임제목</label>
                        <input
                            type="text"
                            placeholder="모임을 표현할 제목을 입력해주세요."
                            maxLength="8"
                        />
                    </div>
                    <div className="form-group">
                        <label>모임설명</label>
                        <textarea
                            placeholder="모임 설명을 입력해주세요."
                            maxLength="30"
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>모임장소</label>
                        <input
                            type="text"
                            placeholder="장소를 입력해주세요(미작성 시 미정)"
                            maxLength="20"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 받은 props의 타입 확인. 매치되지 않으면 오류 발생
GroupModal.propTypes = {
    modalState: PropTypes.string,
    modalTitle: PropTypes.string,
    modalBody: PropTypes.string,
    hideModal: PropTypes.func,
}

export default GroupModal;