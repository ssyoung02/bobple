import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/style/components/ErrorModal.css'; // ErrorModal 스타일 추가

const ErrorModal = ({ message, hideErrorModal }) => {
    return (
        <div className="modal show">
            <div className="modal-error-content">
                <div className="modal-header">
                    <button className="modal-close-btn" onClick={hideErrorModal}>×</button>
                    <h3 className="modal-title">오류</h3>
                </div>
                <div className="modal-error-check-body">
                    <p>{message}</p>
                    <button onClick={hideErrorModal}>확인</button> {/* 확인 버튼 추가 */}
                </div>
            </div>
        </div>
    );
};

ErrorModal.propTypes = {
    message: PropTypes.string.isRequired,
    hideErrorModal: PropTypes.func.isRequired,
};

export default ErrorModal;
