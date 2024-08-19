import React, { useState, useEffect } from 'react';
import {useLocation} from 'react-router-dom';
import axios from 'axios';
import { ArrowLeftLong, ReceiptSettlement, Recipt, RotateLeft, CloseIcon } from "../../components/imgcomponents/ImgComponents";
import '../../assets/style/myPage/Calculator.css';
import { useHeaderColorChange } from '../../hooks/NavigateComponentHooks';
import PageHeader from "../../components/layout/PageHeader";

const Calculator = () => {
    const [file, setFile] = useState(null);
    const [ocrResponse, setOcrResponse] = useState(null);
    const [totalAmount, setTotalAmount] = useState('');
    const [people, setPeople] = useState('');
    const [resultText, setResultText] = useState('');
    const [base64Image, setBase64Image] = useState('');
    const [reciptImage, setReciptImage] = useState(false);
    const [calculatedAmount, setCalculatedAmount] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);

    const location = useLocation();

    useHeaderColorChange(location.pathname, '#AEE2FF');

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const formData = new FormData();
            formData.append('uploadFile', selectedFile);

            try {
                const response = await axios.post('http://localhost:8080/api/Calculator', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.data && response.data.text) {
                    const ocrData = JSON.parse(response.data.text);
                    setOcrResponse(ocrData.ocrResponse);
                    setBase64Image(`data:image/jpeg;base64,${response.data.imageUrl}`);
                    setReciptImage(true);

                    processOCRResponse(ocrData.ocrResponse);
                } else {
                    alert('OCR 처리에 실패했습니다.');
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                alert('파일 업로드 중 오류가 발생했습니다.');
            }
        }
    };

    const handleInputChange = (e) => {
        const inputValue = e.target.value.replace(/,/g, ''); // Remove existing commas
        if (!isNaN(inputValue) && inputValue !== '') {
            const formattedValue = parseInt(inputValue, 10).toLocaleString(); // Add commas
            setResultText(formattedValue);
            setTotalAmount(inputValue);
        } else {
            setResultText(inputValue);
            setTotalAmount(inputValue);
        }
    };

    const removeSpaces = (text) => {
        return text.replace(/\s+/g, ''); // Remove all whitespace
    };

    const processOCRResponse = (ocrResponse) => {
        const TOTAL_AMOUNT_KEYWORDS = [
            '판매총액', '판매 총액', '합계 금액', '판매금액', '판매 금액', '합계금액', '합계 금액',
            '매출합계', '매출 합계', '총결제금액', '총 결제금액', '결제금액', '결제 금액',
            'TOTAL', '영수금액', '영수 금액', '총액', '합계금액', '합계 금액', '합 계', '총구매액', '받을금액',
            '계', '계산서', '합계', '금액'
        ];

        const fields = ocrResponse.images[0].fields;
        let foundAmount = false;
        let extractedAmount = '';

        //console.log("OCR 인식된 모든 텍스트:");

        fields.forEach((field, i) => {
            let text = removeSpaces(field.inferText.trim());

            // 로그로 출력
            //console.log(`Field ${i}: ${text}`);

            // '합계'와 같은 단어를 올바르게 처리하기 위한 조정
            if (text.includes('합') && i + 1 < fields.length) {
                const nextText = removeSpaces(fields[i + 1].inferText.trim());
                if (nextText.startsWith('계')) {
                    text = '합계';
                    i++;
                } else if (nextText.includes('금액')) {
                    text = '합계 금액';
                    i++;
                }
            }

            // 공백 및 특수 문자를 제거하여 텍스트를 정규화
            const normalizedText = removeSpaces(text.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, ''));

            // 총액을 나타낼 수 있는 모든 키워드에 대해 비교
            const isKeywordMatch = TOTAL_AMOUNT_KEYWORDS.some(keyword =>
                removeSpaces(keyword.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '')).includes(normalizedText)
            );

            if (isKeywordMatch) {
                // 다음 필드가 금액일 경우
                if (i + 1 < fields.length) {
                    const nextText = removeSpaces(fields[i + 1].inferText.trim());
                    // 금액을 식별하기 위한 정규 표현식
                    const amountRegex = /^\d{1,3}(,\d{3})*(\.\d+)?(원)?$/;
                    if (amountRegex.test(nextText)) {
                        extractedAmount = nextText.replace(/원/g, ''); // '원' 제거
                        foundAmount = true;
                    }
                }
            }
        });

        if (foundAmount) {
            // 점을 쉼표로 변경
            const formattedAmount = extractedAmount.replace(/\.(?=\d)/g, ',');
            setTotalAmount(formattedAmount.replace(/,/g, '')); // 포맷을 변경한 금액 저장
            setResultText(formattedAmount); // 금액만 저장 (단위 없음)
        } else {
            setTotalAmount('');
            setResultText('총액을 찾을 수 없습니다.'); // 총액을 찾지 못한 경우 메시지 표시
        }
    };

    const handleCalculate = () => {
        const peopleCount = parseFloat(people);
        const totalAmountNum = parseFloat(totalAmount.replace(/,/g, ''));

        if (isNaN(peopleCount) || isNaN(totalAmountNum)) {
            setCalculatedAmount('올바른 숫자를 입력해주세요.');
        } else {
            const perPerson = totalAmountNum / peopleCount;
            setCalculatedAmount(`${perPerson.toLocaleString()}원`);
        }

        setShowResult(true); // Show result section and hide calculate button
    };

    const handleReset = () => {
        setFile(null);
        setOcrResponse(null);
        setTotalAmount('');
        setPeople('');
        setResultText('');
        setBase64Image('');
        setReciptImage(false);
        setCalculatedAmount('');
        setShowResult(false);
    };

    // 이미지 팝업 열기/닫기 핸들러
    const handleImageClick = () => {
        setIsImagePopupOpen(true);
    };

    const closePopup = () => {
        setIsImagePopupOpen(false);
    };


    return (
        <div className="calculator-main">
            <div className="bgcolor-area"></div>
            <PageHeader title="1/N 계산기" />
            <div className="calculator-img">
                {!reciptImage && (
                    <ReceiptSettlement/>
                )}
                {base64Image && (
                    <img
                        className="upload-recipt-img"
                        src={base64Image}
                        alt="Uploaded"
                        id="uploadedImage"
                        onClick={handleImageClick} // 이미지 클릭 핸들러 추가
                    />
                )}
            </div>

            <div className="calculator-receipt">
                <div className="how-many">
                    <h5>함께 식사한 인원은</h5>
                    <div className="how-many-people">
                        <input
                            className="input-people"
                            type="number"
                            value={people}
                            onChange={(e) => setPeople(e.target.value)}
                            placeholder="인원 수"
                        />
                        <span>명</span>
                    </div>
                </div>
                <div className="receipt-upload">
                    <h5>영수증으로 계산</h5>
                    <div className="receipt-upload-box">
                        <div className="upload-recipt-text">
                            <input
                                className="upload-recipt-money"
                                type="text"
                                placeholder="회식 금액입력"
                                value={resultText}
                                onChange={handleInputChange}
                            />
                            <span>원</span>
                        </div>
                        <label>
                            <input className="upload-recipt" type="file" onChange={handleFileChange} title="영수증 첨부"/>
                            <Recipt />
                        </label>
                    </div>
                </div>
                <div className="calculator-result">
                    {!showResult && (
                        <button className="calculator-button" onClick={handleCalculate}>계산하기</button>
                    )}
                    {showResult && (
                        <>
                            <div className="result-money">
                                <span>1인당</span>
                                {calculatedAmount}
                            </div>
                            <button className="calculator-reset-button" onClick={handleReset}>다시 계산하기 <RotateLeft/></button>
                        </>
                    )}
                </div>
            </div>

            {/* 이미지 팝업 */}
            {isImagePopupOpen && (
                <div className="popup-overlay" onClick={closePopup}>
                    <div className="popup-content">
                        <button className="popup-close" onClick={closePopup} aria-label="닫기">
                            <CloseIcon />
                        </button>
                        <img src={base64Image} alt="Popup" className="popup-image" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calculator;
