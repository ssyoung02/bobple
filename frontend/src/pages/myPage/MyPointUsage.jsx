import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/style/myPage/MyPointUsage.css';

function MyPointUsage() {
    const [pointHistory, setPointHistory] = useState([]);
    const [currentPoints, setCurrentPoints] = useState(0);
    const [nickName, setNickName] = useState('');
    const [error, setError] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
    const [filter, setFilter] = useState('전체기한');

    const userIdx = localStorage.getItem('userIdx');
    const token = localStorage.getItem('token');

    const months = [
        { value: 1, label: '1월' },
        { value: 2, label: '2월' },
        { value: 3, label: '3월' },
        { value: 4, label: '4월' },
        { value: 5, label: '5월' },
        { value: 6, label: '6월' },
        { value: 7, label: '7월' },
        { value: 8, label: '8월' },
        { value: 9, label: '9월' },
        { value: 10, label: '10월' },
        { value: 11, label: '11월' },
        { value: 12, label: '12월' }
    ];

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i); // Last 10 years

    useEffect(() => {
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }
        fetchPointHistory();
    }, [filter, selectedMonth, selectedYear]);

    const fetchPointHistory = async () => {
        try {
            let url = `http://localhost:8080/api/points/${userIdx}/`;

            switch (filter) {
                case '전체기한':
                    url += 'all-time';
                    break;
                case '달마다':
                    url += `monthly?month=${selectedMonth}&year=${selectedYear}`;
                    break;
                case '1년마다':
                    url += `yearly?year=${selectedYear}`;
                    break;
                default:
                    url += 'all-time';
            }

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });

            setNickName(response.data.nickName);
            setCurrentPoints(response.data.currentPoints);
            setPointHistory(response.data.history);
        } catch (error) {
            console.error('포인트 이력을 가져오는 데 실패했습니다.', error);
            setError('포인트 이력을 가져오는 중 오류가 발생했습니다.');
        }
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="my-point-usage-main">
            <div className="my-point-total">
                <h3>{nickName}님의 포인트</h3>
                <h3 className="mypoint">{currentPoints}P</h3>
            </div>

            <div className="filter-buttons">
                <button onClick={() => handleFilterChange('전체기한')}>전체기한</button>
                <button onClick={() => handleFilterChange('달마다')}>달마다</button>
                <button onClick={() => handleFilterChange('1년마다')}>1년마다</button>
            </div>

            {filter === '달마다' && (
                <div className="month-year-select">
                    <label htmlFor="year">년도: </label>
                    <select
                        id="year"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="month">월: </label>
                    <select
                        id="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    >
                        {months.map((month) => (
                            <option key={month.value} value={month.value}>
                                {month.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {filter === '1년마다' && (
                <div className="year-select">
                    <label htmlFor="year">년도: </label>
                    <select
                        id="year"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="point-usage-box">
                <h5>포인트 사용 내역 ({filter})</h5>
                <ul className="point-usage-list">
                    {pointHistory.map((point, index) => (
                        <li key={index}>
                            <div className="point-usage-details">
                                <p className="point-usage-date">{new Date(point.createdAt).toLocaleString()}</p>
                                <h6 className="point-usage-title">
                                    {point.pointComment}
                                </h6>
                            </div>
                            <div className="budget">
                                <p className={point.pointState === 'M' ? 'point-usage-money deduction' : 'point-usage-money'}>
                                    {(point.pointState === 'M' ? '-' : '+') + Math.abs(point.pointValue)}P
                                </p>
                                <p className="balance">
                                    잔액: {point.pointBalance}P
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default MyPointUsage;
