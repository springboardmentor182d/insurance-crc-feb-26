import api from './api'; 

export const submitClaimData = async (claimData) => {
    try {
        const response = await api.post('/submit-claim', claimData);
        return response.data;
    } catch (error) {
        console.error("Error submitting claim:", error);
        throw error;
    }
};

export const fetchAllClaims = async () => {
    try {
        const response = await api.get('/get-claims');
        return response.data;
    } catch (error) {
        console.error("Error fetching claims:", error);
        throw error;
    }
};