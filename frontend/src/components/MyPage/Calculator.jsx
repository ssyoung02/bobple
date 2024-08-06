import React, { useState } from 'react';
import axios from 'axios';

function Calculator() {
    const [file, setFile] = useState(null);
    const [ocrResponse, setOcrResponse] = useState(null);
    const [totalAmount, setTotalAmount] = useState('');
    const [people, setPeople] = useState('');
    const [resultText, setResultText] = useState('');
    const [base64Image, setBase64Image] = useState('');
    const [calculatedAmount, setCalculatedAmount] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        // 파일이 변경될 때 이전 결과와 이미지 초기화
        setTotalAmount('');
        setPeople('');
        setResultText('');
        setCalculatedAmount('');
        setBase64Image('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            alert('영수증 사진을 업로드해주세요');
            return;
        }

        const formData = new FormData();
        formData.append('uploadFile', file);

        try {
            const response = await axios.post('http://localhost:8080/MyPage/Calculator', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data && response.data.text) {
                const ocrData = JSON.parse(response.data.text);
                setOcrResponse(ocrData.ocrResponse);
                setBase64Image(`data:image/jpeg;base64,${response.data.imageUrl}`);

                processOCRResponse(ocrData.ocrResponse);
            } else {
                alert('OCR 처리에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error Response:', error);
            alert('오류 발생: ' + error.response?.data || '알 수 없는 오류');
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

        console.log("OCR 인식된 모든 텍스트:");

        fields.forEach((field, i) => {
            let text = removeSpaces(field.inferText.trim());

            // 로그로 출력
            console.log(`Field ${i}: ${text}`);

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
                        extractedAmount = nextText.replace('원', ''); // '원' 제거
                        foundAmount = true;
                    }
                }
            }
        });

        if (foundAmount) {
            // 점을 쉼표로 변경
            const formattedAmount = extractedAmount.replace(/\.(?=\d)/g, ',');
            setTotalAmount(formattedAmount); // 포맷을 변경한 금액 저장
            setResultText(`${formattedAmount}원`); // 금액과 '원'을 붙여서 저장
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
            setCalculatedAmount(`1인당 금액: ${perPerson.toLocaleString()}원`);
        }
    };

    return (
        <div>
            <h3>OCR : 텍스트 추출</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    파일 :
                    <input type="file" onChange={handleFileChange} />
                </label>
                <button type="submit">결과 확인</button>
            </form>

            <br />
            <h3>OCR : 텍스트 추출 결과</h3>
            <pre>총 합계금액 : {resultText}</pre>

            <br />
            <h3>OCR : 원본 이미지 파일</h3>
            {base64Image && (
                <img
                    src={base64Image}
                    alt="Uploaded"
                    id="uploadedImage"
                    style={{
                        width: '300px', // 원하는 너비
                        height: 'auto', // 자동 높이 조정
                        objectFit: 'contain' // 이미지 비율 유지하며 잘림 방지
                    }}
                />
            )}

            <br /><br />
            <input
                type="text"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="총액"
            /> {' / '}
            <input
                type="number"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                placeholder="인원 수"
            />
            <button onClick={handleCalculate}>계산하기</button>
            <div id="result">{calculatedAmount}</div>

            <br />
            <a href="index2">index2 페이지로 이동</a>
        </div>
    );
};

export default Calculator;
