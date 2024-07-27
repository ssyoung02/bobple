// import React, { useEffect } from 'react';
// import axios from 'axios';
//
// const KakaoLogin = () => {
//     useEffect(() => {
//         const url = new URL(window.location.href);
//         const code = url.searchParams.get('code');
//
//         if (code) {
//             const fetchToken = async () => {
//                 try {
//                     const response = await axios.get(`http://localhost:8080/auth/kakao?code=${code}`);
//                     localStorage.setItem('token', response.data.token); // Assuming the token is in response.data.token
//                     window.location.href = "/";
//                 } catch (error) {
//                     console.error('There was an error!', error);
//                 }
//             };
//             fetchToken();
//         }
//     }, []);
//
//     return (
//         <div>
//             인증 처리 중...
//         </div>
//     );
// };
//
// export default KakaoLogin;
