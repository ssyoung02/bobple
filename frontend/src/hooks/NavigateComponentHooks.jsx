import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const header = document.querySelector('.header');
const main = document.querySelector('main');
const navBar = document.querySelector('.navBar');

const useHeaderColorChange = (changeColor) => {

    useEffect(() => {

        const changeBackgroundColor = () => {
                if (header) header.style.backgroundColor = changeColor;
                if (main) main.style.backgroundColor = changeColor;
        };

        changeBackgroundColor(); // 초기 배경 색상을 설정

        return () => {
            if (header) header.style.backgroundColor = ''; // 언마운트 시 초기화
            if (navBar) navBar.style.backgroundColor = ''; // 언마운트 시 초기화
        };
    }, [changeColor]);
};

export default useHeaderColorChange;

export const useNavigateNone = () => {
    useEffect(() => {

        const changeDisplay = () => {
            if (header) header.style.display = 'none';
            if (navBar) navBar.style.display = 'none';
            if (main) main.style.height = '100dvh';
        };

        changeDisplay(); // 초기 display 설정

        return () => {
            if (header) header.style.display = 'flex'; // 언마운트 시 초기화
            if (navBar) navBar.style.display = 'flex'; // 언마운트 시 초기화
            if (main) main.style.height = '';
        };
    }, []); // 빈 의존성 배열을 추가하여 한 번만 실행되도록 함
};
