const { default: axios } = require("axios");
require('dotenv').config();


const cassoLinkBank = async (data) => {
    try {
        const dataBank = {
            bank_name: data.bank_name,
            bank_account: data.bank_account,
            bank_branch: data.bank_branch
        }
        const response = await axios.post(`${process.env.URL_CASSO}/link_bank_account`, { data: dataBank }, {
            headers: {
                'Authorization': `Apikey ${process.env.CASSO_API_KEY}`,
                'Content-Type': 'application/json'
            },
            
        });
        return response.data;
    } catch (error) {
        console.log("error::", error.response ? error.response.data : error.message);
        throw new Error(`Có lỗi xảy ra khi liên kết tài khoản ngân hàng mã lỗi:  ${error.code}`);
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