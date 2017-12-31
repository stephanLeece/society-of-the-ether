import axios from 'axios';

var instance = axios.create({
    xsrfCookieName: 'wutang',
    xsrfHeaderName: 'csrf-token'
});

export default instance;
