const { default: axios } = require("axios");
require('dotenv').config();


const cassoLinkBank = async (data) => {
    try {
        const response = await axios.post(`${process.env.URL_CASSO}/banks`, {
            headers: {
                'Authorization': `Apikey ${process.env.CASSO_API_KEY}`
            },
            // Dữ liệu ngân hàng từ request body của bạn
            data: {
                bank_name: req.body.bank_name,
                bank_account: req.body.bank_account,
                bank_branch: req.body.bank_branch
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Có lỗi xảy ra khi liên kết tài khoản ngân hàng');
    }

}
const getInfoBank = async () => {
    try {
        const url = `${process.env.URL_CASSO}/userInfo`;

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Apikey ${process.env.CASSO_API_KEY}`
            }
        });
        console.log(response.data.data);

        return response.data.data;
    } catch (error) {
        throw new Error('Có lỗi xảy ra khi lấy thông tin giao dịch', error);
    }
}
const getTransaction = async (data) => {
        const url = `${process.env.URL_CASSO}/transactions`;

        const response = await axios.get(url, {
            params: { bank_id: cassoBankId },
            headers: {
                'Authorization': `Apikey ${process.env.CASSO_API_KEY}`
            }
        });
        console.log(response.data.data);

        return response.data.data;
}
const getTransactionDetail = async (data) => {
   
        const url = `${process.env.URL_CASSO}/transactions/${data.transaction_id}`;

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Apikey ${process.env.CASSO_API_KEY}`
            }
        });
        console.log(response.data.data);

        return response.data.data;
}
const getInfoConnected = async (data) => {
        const url = `${process.env.URL_CASSO}/accounts`;

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Apikey ${process.env.CASSO_API_KEY}`
            }
        });
        console.log(response.data.data);

        return response.data.data;
}
module.exports = { cassoLinkBank, getTransaction, getInfoBank, getTransactionDetail, getInfoConnected }