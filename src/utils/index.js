const _ = require('lodash');

const getInfoData = ({ fileds = [], object = {} }) => {
    return _.pick(object, fileds);
}
const removeEmptyFields = (data) => {
    return Object.entries(data).reduce((a, [k, v]) => {
        if (v != null) {
            a[k] = v;
            if (typeof v === 'object' && !Array.isArray(v)) {
                a[k] = removeEmptyFields(v);
            } else {
                a[k] = v;
            }
        }
        return a;
    }, {});
}
module.exports = {
    getInfoData,
    removeEmptyFields
}