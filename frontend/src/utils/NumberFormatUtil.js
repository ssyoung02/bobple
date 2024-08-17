export const formatViewsCount = (viewsCount) => {
    if (typeof viewsCount !== 'number' || isNaN(viewsCount)) {
        return '0';
    }
    if (viewsCount >= 1000) {
        return `${(viewsCount / 1000).toFixed(1)}k`; // 예: 1.2k
    }
    return viewsCount.toString();
};
