import Api from './http.js';
import Translator from './translator.js';
import Router from './router.js';
import MainPage from './pages/MainPage.js'

class Context {
    constructor(rootEl, api, router, translator, mediaUrl) {
        this._rootEl = rootEl;
        this._api = api;
        this._router = router;
        this._router.onUserGoBack(path => {
            this.route(path, false);
        });
        this._translator = translator;
        this._path = '/';
        this._pathParams = {};
        this._component = null;
        this._mediaUrl = mediaUrl;
        this.route(this._path);
    }

    rootEl() {
        return this._rootEl;
    }

    translate(code) {
        console.log(code);
        return this._translator.translate(code);
    }

    route(path, push = true) {
        this.destroyComponent();
        this._path = path;
        const {component, params} = this._router.route(path, push);
        this._component = new component(this);
        this._pathParams = params;
        this.initComponent();
    }

    pathParams() {
        return this._pathParams;
    }

    get(path, headers = {}, onSuccess = null, onFail = null) {
        this._api.get(path, headers, onSuccess, onFail);
    };

    post(path, data, headers = {}, onSuccess = null, onFail = null) {
        this._api.post(path, data, headers, onSuccess, onFail);
    };

    delete(path, headers = {}, onSuccess = null, onFail = null) {
        this._api.delete(path, headers, onSuccess, onFail);
    };

    initComponent() {
        if (!this._component) {
            return;
        }
        if (typeof this._component.init !== 'function') {
            return;
        }
        this._component.init();
    }

    destroyComponent() {
        if (!this._component) {
            return;
        }
        if (typeof this._component.destroy !== 'function') {
            return;
        }
        this._component.destroy();
    }
}


const translator = new Translator();
const router = new Router();

router.register('/', MainPage);

const backendUrl = 'https://dpr-back.herokuapp.com';

const api = new Api(`${backendUrl}/api/v1`);
new Context(document.getElementById('root'), api, router, translator, backendUrl);

