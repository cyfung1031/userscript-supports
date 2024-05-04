// ==UserScript==
// @name         YouTube视频&音乐&儿童广告拦截
// @name:zh-CN   YouTube视频&音乐&儿童广告拦截
// @name:zh-TW   YouTube視頻&音樂&兒童廣告攔截
// @name:zh-HK   YouTube視頻&音樂&兒童廣告攔截
// @name:en      YouTubeVideo&music&kidsAdBlocking
// @namespace    http://tampermonkey.net/
// @version      1.4.3.001
// @description  拦截所有youtube视频广告，音乐播放广告，儿童视频广告，不留白，不闪屏，无感，体验第一。已适配移动端，支持自定义拦截,添加影视频道
// @description:zh-CN  拦截所有youtube视频广告，音乐播放广告，儿童視頻廣告，不留白，不闪屏，无感，体验第一。已适配移动端，支持自定义拦截,添加影视频道
// @description:zh-TW  攔截所有YouTube視頻廣告，音樂播放廣告，兒童視頻廣告，不留白，不閃屏，無感，體驗第一。已適配移動端，支持自定義攔截，添加影視頻道
// @description:zh-HK  攔截所有YouTube視頻廣告，音樂播放廣告，兒童視頻廣告，不留白，不閃屏，無感，體驗第一。已適配移動端，支持自定義攔截，添加影視頻道
// @description:en Intercept all YouTube video ads, music playback ads, youtube kids ads, without leaving blank space, no flash screens, seamless experience, the first choice in user experience. Adapted for mobile devices, supports customizable interception, and allows the addition of video channels
// @author       hua
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://music.youtube.com/*
// @match        https://www.youtubekids.com/watch*
// @exclude      /^https?://\w+\.youtube\.com\/live_chat.*$/
// @exclude      /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @connect      https://update.greasyfork.org/
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @icon https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-start
// @license      MIT
// ==/UserScript==


const open_config_keyword = '2333';

const display_error_keyword = '2444';

let channel_id = GM_getValue('last_channel_id', 'default');

const user_data_api = get_user_data_api();

const user_data = user_data_api.get();

let open_recommend_tv_goodselect = 'on';

let open_recommend_featured = 'on';

let tmp_debugger_value;

let limit_eval = false;

let local_this = this;

let is_account_init;

const inject_info = {
    "ytInitialPlayerResponse": false,
    "ytInitialData": false,
    "ytInitialReelWatchSequenceResponse": false,
    "xhr": false,
    "fetch": false
};

let orgin_console = console;
const script_url = 'https://update.greasyfork.org/scripts/480192/youtube%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA.user.js';
let href = location.href;
let ytInitialPlayerResponse_rule;
let ytInitialData_rule;

let ytInitialReelWatchSequenceResponse_rule;

let open_debugger = true;
let isinint = false;
let mobile_web;
let movie_channel_info;
let mobile_movie_channel_info;
let flag_info;

let debugger_ytInitialPlayerResponse;
let debugger_ytInitialData;
let debugger_ytInitialReelWatchSequenceResponse;
let page_type = '';
let error_messages = [];
let data_process;
let shorts_fun;
let yt_api;
const shorts_parse_delay = 500;
let user_data_listener;

const SPLIT_TAG = '###';

class DATA_PROCESS {
    constructor() {
        try {
            let test_eval;
            const test_val = 1;
            this.limit_eval = eval('test_eval = test_val') && (test_eval !== test_val);
        } catch (error) {
            this.limit_eval = true;
        }
        this.obj_filter;
        this.obj_storage = {};
    }
    storage_obj(key, obj) {
        this.obj_storage[key] = obj;
    }
    set_obj_filter = function (obj_filter) {
        this.obj_filter = typeof obj_filter === 'function' ? obj_filter : undefined;
    };
    text_process(data, values, mode, traverse_all) {
        if (!values) return data;
        mode = mode || 'cover';
        if (mode === 'reg') {
            for (let value of values) {
                let patten_express = value.split(SPLIT_TAG)[0];
                let replace_value = value.split(SPLIT_TAG)[1];
                let patten = new RegExp(patten_express, "g");
                data = data.replace(patten, replace_value);
            }
        }
        if (mode === 'cover') {
            data = values[0];
        }
        if (mode === 'insert') {
            traverse_all = traverse_all || false;
            let json_data;
            try {
                json_data = JSON.parse(data);
            } catch (error) {
                log('text_process JSON parse error', -1);
                return data;
            }
            this.obj_process(json_data, values, traverse_all);
            data = JSON.stringify(json_data);
        }
        return data;
    }

    value_parse(parse_value) {
        parse_value = parse_value.trim();
        const json_math = parse_value.match(/^json\((.*)\)$/);
        if (json_math) return JSON.parse(json_math[1]);
        const obj_match = parse_value.match(/^obj\((.*)\)$/);
        if (obj_match) return this.string_to_value(unsafeWindow, obj_match[1]);
        const number_match = parse_value.match(/^num\((.*)\)$/);
        if (number_match) return Number(number_match[1]);
        const method_match = parse_value.match(/^method\((.*)\)$/);
        if (method_match) {
            // eval 限制的时候可以使用num() obj()这些添加数字对象 方法也要放到unsafeWindow里 例：method(b("123",num(23)))
            // 不限制的时候 不能使用num和obj 方法不需要放到unsafeWindow里 例：method(b("123",23))
            if (limit_eval) {
                method_info = method_match[1].match(/(.*?)\((.*)\)$/);
                method_name = method_info[1];
                method_args_string = method_info[2];
                method_args = method_args_string.split(',');
                const args = [];
                for (let arg of method_args) {
                    args.push(value_parse(arg));
                }
                return unsafeWindow[method_name](...args);
            }
            return eval(method_match[1]);
        }
        const string_match = parse_value.match(/^["'](.*)["']$/);
        if (string_match) return string_match[1];
        if (parse_value === 'undefined') return undefined;
        if (parse_value === 'null') return null;
        return parse_value;
    }
    string_to_value(obj, path) {
        try {
            if (!this.limit_eval) {
                return eval(path.replace('json_obj', 'obj'));
            }
            let tmp_obj = obj;
            let matches = path.match(/\[(.*?)\]/g);
            if (matches) {
                matches.map((match) => {
                    if (match.includes('["')) {
                        tmp_obj = Reflect.get(tmp_obj, match.replace(/\["|"\]/g, ''));
                    } else {
                        tmp_obj = Reflect.get(tmp_obj, Number(match.replace(/\[|\]/g, '')));
                    }
                });
                return tmp_obj;
            }
            matches = path.split('.');
            if (matches) {
                matches.splice(0, 1);
                matches.map((match) => {
                    tmp_obj = Reflect.get(tmp_obj, match);
                });
                return tmp_obj;
            }
        } catch (error) {
            // log('获取属性值失败--->' + path, 'obj_process')
        }
    }
    get_lastPath_and_key(path) {
        let last_path, last_key;
        let matches = path.match(/\[(.*?)\]/g);
        if (matches && matches.length > 0) {
            const tmp = matches[matches.length - 1];
            if (tmp.includes('["')) {
                last_key = tmp.replace(/\["|"\]/g, '');
            } else {
                last_key = Number(tmp.replace(/\[|\]/g, ''));
            }
            last_path = path.substring(0, path.lastIndexOf(tmp));
        }
        if (!matches) {
            matches = path.split('.');
            if (matches && matches.length > 0) {
                last_key = matches[matches.length - 1];
                last_path = path.replace('.' + last_key, '');
            }
        }
        return [last_path, last_key];

    }

    obj_process(json_obj, express_list, traverse_all = false) {
        let data_this = this;
        let abs_path_info_list = [];
        let relative_path_info_list = [];
        let relative_path_list = [];
        let relative_short_path_list = [];
        if (!json_obj || !express_list) return;
        const is_array_obj = Array.isArray(json_obj);
        function add_data_to_abs_path(path, express, relative_path, operator, value, condition, array_index, path_extral, value_mode) {
            let tmp;
            path = path.replace(/\.[\d\w\-\_\$@]+/g, function (match) {
                return '["' + match.slice(1) + '"]';
            });
            if (array_index !== "*") {
                tmp = {};
                path = path + (array_index ? '[' + array_index + ']' : '');
                tmp.path = path;
                tmp.relative_path = relative_path;
                tmp.operator = operator;
                tmp.value = value;
                tmp.value_mode = value_mode;
                tmp.condition = condition;
                tmp.path_extral = path_extral;
                tmp.express = express;
                abs_path_info_list.push(tmp);
                return;
            }
            let array_length;
            try {
                array_length = data_this.string_to_value(json_obj, path).length;
                if (!array_length) return;
            } catch (error) {
                return;
            }
            for (let tmp_index = array_length - 1; tmp_index >= 0; tmp_index--) {
                tmp = {};
                tmp.path = path + "[" + tmp_index + "]";
                tmp.operator = operator;
                tmp.value = value;
                tmp.value_mode = value_mode;
                tmp.condition = condition;
                tmp.path_extral = path_extral;
                tmp.relative_path = relative_path;
                tmp.express = express;
                abs_path_info_list.push(tmp);
            }
        }

        function obj_property_traverse(obj, cur_path, dec_infos, dec_list, dec_index_list, traverse_all = false) {
            if (Array.isArray(obj)) {
                obj.forEach((tmp_obj, index) => {
                    let tmp_path = cur_path + '[' + index + ']';
                    if (!tmp_obj || typeof (tmp_obj) !== 'object') return;
                    obj_property_traverse(tmp_obj, tmp_path, dec_infos, dec_list, dec_index_list, traverse_all);
                });
                return;
            }
            Object.keys(obj).forEach((key) => {
                let tmp_path = cur_path + '.' + key;
                let deal = false;
                for (let i = 0; i < dec_infos["short_keys"].length; i++) {
                    if (dec_infos["short_keys"][i] === key) {
                        let len = dec_infos["real_keys"][i].length;
                        if (tmp_path.slice(tmp_path.length - len) === dec_infos["real_keys"][i]) {
                            dec_list.push(tmp_path);
                            dec_index_list.push(i);
                            if (!deal && traverse_all && typeof (obj[key]) === 'object') {
                                obj_property_traverse(obj[key], tmp_path, dec_infos, dec_list, dec_index_list, traverse_all);
                            }
                            deal = true;
                        }
                    }
                }
                let value = obj[key];
                if (deal || !value || typeof (value) !== 'object') return;
                obj_property_traverse(value, tmp_path, dec_infos, dec_list, dec_index_list, traverse_all);
            });
        }

        function obj_modify(json_obj, path_info) {
            let path = path_info['deal_path'];
            let operator = path_info['operator'];
            let value = path_info['value'];
            let [last_path, last_key] = data_this.get_lastPath_and_key(path);
            let last_obj = data_this.string_to_value(json_obj, last_path);
            if (operator === '=-') {
                let is_array = typeof last_key === 'number';
                if (!last_obj) throw new Error('last_obj is null');
                if (is_array)
                    last_obj.splice(last_key, 1);
                else
                    delete last_obj[last_key];
                log('依据：' + path_info.express, 'obj_process');
                log('删除属性-->' + path, 'obj_process');
                return;
            }
            let dec_obj = last_obj[last_key];
            if (operator === '=+') {
                value = data_this.value_parse(value);
                if (dec_obj === null || dec_obj === undefined) throw new Error('dec_obj is null');
                let type_ = typeof dec_obj;
                if (Array.isArray(dec_obj)) type_ = 'array';
                if (type_ === 'array') {
                    let mode_info = path_info.value_mode;
                    if (mode_info) {
                        try {
                            mode_info.mode === 'arr_insert' && last_obj[last_key].splice(Number(mode_info.params[0]), 0, value);
                        } catch (error) {
                            log(error, -1);
                        }
                    } else {
                        last_obj[last_key].push(value);
                    }
                }
                if (type_ === 'string' || type_ === 'number') last_obj[last_key] = last_obj[last_key] + value;
                log('依据：' + path_info.express, 'obj_process');
                log('修改属性-->' + path, 'obj_process');
            }
            if (operator === '~=') {
                let search_value = value.split(SPLIT_TAG)[0];
                let replace_value = value.split(SPLIT_TAG)[1];
                last_obj[last_key] = dec_obj.replace(new RegExp(search_value, 'g'), replace_value);
                log('依据：' + path_info.express, 'obj_process');
                log('修改属性-->' + path, 'obj_process');
            }
            if (operator === '=') {
                value = data_this.value_parse(value);
                last_obj[last_key] = value;
                log('依据：' + path_info.express, 'obj_process');
                log('修改属性-->' + path, 'obj_process');
            }
        }

        express_list.forEach(express => {
            if (!express) return;
            let reg;
            let express_type = typeof (express);
            let matches;
            let conditions;
            let value;
            reg = /^(abs:)?([a-zA-Z_0-9\.\*\[\]]*)((=\-|~=|=\+|=))(.*)?/;
            if (express_type === 'string') {
                matches = express.match(reg);
            } else {
                matches = express.value.match(reg);
                conditions = express.conditions;
            }
            let abs = matches[1];
            let path = matches[2];
            let path_extral_match = path.match(/\/?\.+$/);
            let path_extral;
            if (path_extral_match) {
                path_extral = {};
                let len;
                if (path_extral_match[0].startsWith('/')) {
                    len = path_extral_match[0].length - 1;
                    path_extral['child'] = len;
                } else {
                    len = path_extral_match[0].length;
                    path_extral['parent'] = len;
                }
                path = path.slice(0, path.length - len);
            }
            let operator = matches[3];
            let value_mode;
            if (express_type === 'string') {
                let tmp_value = matches[5] || '';
                let split_index = tmp_value.indexOf(' ');
                if (split_index > -1) {
                    value = tmp_value.substring(0, split_index);
                    let mode_match = value.match(/^\((.*)\)$/);
                    if (mode_match) {
                        let mode_info = mode_match[1].split(',');
                        value = mode_info[1];
                        let mode = mode_info[0];
                        mode_info.shift();
                        mode_info.shift();
                        value_mode = {
                            'mode': mode,
                            'params': mode_info
                        };
                    }
                    conditions = tmp_value.substring(split_index + 1);
                    conditions = {
                        'value': [conditions]
                    };
                } else {
                    value = tmp_value;
                }
            }
            matches = path.match(/\[(\*?\d*)\]$/);
            let array_index;
            if (matches) {
                path = path.replace(/\[(\*?\d*)\]$/, '');
                array_index = matches[1];
            }
            if (abs) {
                add_data_to_abs_path(`json_obj${is_array_obj ? '' : '.'}` + path, express, path, operator, value, conditions, array_index, path_extral, value_mode);
            } else {
                relative_path_list.push(path);
                let tmp_short_path = path.split('.').pop();
                relative_short_path_list.push(tmp_short_path);
                relative_path_info_list.push({
                    "express": express,
                    "path": path,
                    "operator": operator,
                    "value": value,
                    "value_mode": value_mode,
                    "conditions": conditions,
                    "array_index": array_index,
                    "path_extral": path_extral
                });
            }
        });
        if (relative_path_list.length > 0) {
            let dec_list = [];
            let dec_index_list = [];
            obj_property_traverse(json_obj, '', {
                "short_keys": relative_short_path_list,
                "real_keys": relative_path_list
            }, dec_list, dec_index_list, traverse_all);
            for (let i = 0; i < dec_index_list.length; i++) {
                let real_index = dec_index_list[i];
                let real_path_info = relative_path_info_list[real_index];
                let tmp_path = 'json_obj' + dec_list[i];
                add_data_to_abs_path(tmp_path, real_path_info.express, real_path_info.path, real_path_info.operator, real_path_info.value, real_path_info.conditions, real_path_info.array_index, real_path_info.path_extral, real_path_info.value_mode);
            }
        }
        abs_path_info_list.sort((a, b) => a < b ? 1 : -1);
        for (let path_info of abs_path_info_list) {
            if (!this.obj_conditional(path_info, json_obj)) continue;
            let operator = path_info.operator;
            let path = path_info.path;
            let value = path_info.value;
            let path_extral = path_info.path_extral;
            if (path_extral) {
                let positions = [];
                let regex = /\]/g;
                let match;
                while ((match = regex.exec(path)) !== null) {
                    positions.push(match.index);
                }
                if (positions.length === 0) continue;
                if ('parent' in path_extral) {
                    if (positions.length - path_extral['parent'] - 1 < 0) continue;
                    let split_index = positions[positions.length - path_extral['parent'] - 1] + 1;
                    path = path.slice(0, split_index);
                }
            }
            path_info.deal_path = path;
            if (this.obj_filter && this.obj_filter(path_info, json_obj)) continue;
            obj_modify(json_obj, path_info);
        }
    }

    value_conditional(value, condition_express) {
        let reg = /(\$text|\$value|\$exist|\$notexist)?((>=|<=|>|<|!~=|!=|~=|=))?(.*)/;
        let match = condition_express.match(reg);
        let condition_type = match[1] || '$text';
        let condition_operator = match[2];
        let condition_test_value = match[4];

        if (condition_type === '$value') {
            if (!['>=', '<=', '>', '<', '='].includes(condition_operator)) return false;
            if (condition_operator === '=') return condition_test_value === value;
            if (condition_operator === '>=') return value >= condition_test_value;
            if (condition_operator === '<=') return value <= condition_test_value;
            if (condition_operator === '>') return value > condition_test_value;
            if (condition_operator === '<') return value < condition_test_value;
        }
        if (condition_type === '$exist') {
            return value !== undefined && value !== null;
        }
        if (condition_type === '$notexist') {
            return value === undefined || value === null;
        }
        if (condition_type === '$text') {
            if (typeof (value) === 'object') value = JSON.stringify(value);
            if (condition_operator === '!=') return condition_test_value !== value;
            if (condition_operator === '=') return condition_test_value === value;
            if (condition_operator === '~=') return new RegExp(condition_test_value).test(value);
            if (condition_operator === '!~=') return !new RegExp(condition_test_value).test(value);
            if (condition_operator === '>=') return value.length >= condition_test_value.length;
            if (condition_operator === '>') return value.length > condition_test_value.length;
            if (condition_operator === '<=') return value.length <= condition_test_value.length;
            if (condition_operator === '>') return value.length > condition_test_value.length;
        }
        return false;
    }

    obj_conditional(express_info, json_obj) {
        //json_obj 在eval里直接调用
        if (!express_info['condition']) return true;
        let condition_infos = express_info['condition'];
        // 与 
        for (let condition_list of Object.values(condition_infos)) {
            let result = false;
            for (let condition of condition_list) {
                let reg = /^([a-zA-Z_0-9\/\.@\[\]]*)?(.*)/;
                let match = condition.match(reg);
                let condition_path = match[1];
                let mod;
                if (condition_path) {
                    if (condition_path.startsWith('/')) {
                        mod = 'child';
                    } else if (condition_path.startsWith('.')) {
                        mod = 'parent';
                    } else if (condition_path.startsWith('@')) {
                        mod = 'global';
                    } else {
                        mod = 'other';
                    }
                } else {
                    condition_path = express_info.path;
                }
                let conditional_express = match[2];
                if (mod === 'child') {
                    condition_path = express_info.path + condition_path.slice(1).replace(/\.[\d\w\-\_\$@]+/g, function (match) {
                        return '["' + match.slice(1) + '"]';
                    });
                }
                if (mod === 'parent') {
                    let reg = /^\.+/;
                    let matches = condition_path.match(reg);
                    let positions = [];
                    let regex = /\]/g;
                    while ((match = regex.exec(express_info.path)) !== null) {
                        positions.push(match.index);
                    }
                    if (positions.length > 0) {
                        let split_index = positions[positions.length - matches[0].length - 1] + 1;
                        let short_condition_path = condition_path.replace(reg, '');
                        if (!short_condition_path.startsWith('[')) {
                            short_condition_path = '.' + short_condition_path;
                        }
                        condition_path = express_info.path.slice(0, split_index) + short_condition_path.replace(/\.[\d\w\-\_\$@]+/g, function (match) {
                            return '["' + match.slice(1) + '"]';
                        });
                    }
                }
                if (mod === 'other') {
                    condition_path = (`json_obj${is_array_obj ? '' : '.'}` + condition_path).replace(/\.[\d\w\-\_\$@]+/g, function (match) {
                        return '["' + match.slice(1) + '"]';
                    });
                }
                if (mod === 'global') {
                    condition_path = condition_path.replace('@', limit_eval ? 'unsafeWindow.' : '');
                }
                let condition_value;
                try {
                    condition_value = this.string_to_value(mod === 'global' ? unsafeWindow : json_obj, condition_path);
                } catch (error) {
                    continue;
                }
                result = this.value_conditional(condition_value, conditional_express);
                if (result) {
                    express_info.condition_value = condition_value;
                    log('条件成立-->', condition_value, 'obj_process');
                    break;
                }
            }
            if (!result) return false;
        }
        return true;
    }
}

url_observer();
init();

function init() {
    log('初始化开始！', 0);
    set_debugger();
    is_account_init = false;
    shorts_fun = get_shorts_fun();
    yt_api = get_yt_api();
    page_type = get_page_type();
    if (page_type === 'yt_shorts') shorts_fun.check_shorts_exist();
    data_process = new DATA_PROCESS();
    data_process.set_obj_filter(obj_process_filter);
    limit_eval = data_process.limit_eval;
    config_init(user_data.language);
    let ytInitialPlayerResponse_value = unsafeWindow['ytInitialPlayerResponse'];
    define_property_hook(unsafeWindow, 'ytInitialPlayerResponse', {
        get: function () {
            return ytInitialPlayerResponse_value;
        },
        set: function (value) {
            inject_info.ytInitialPlayerResponse = true;
            if (value && open_debugger) debugger_ytInitialPlayerResponse = (typeof (value) === 'string') ? JSON.parse(value) : JSON.parse(JSON.stringify(value));
            let start_time = Date.now();
            value && data_process.obj_process(value, ytInitialPlayerResponse_rule, true);
            log('ytInitialPlayerResponse 时间：', Date.now() - start_time, 'spend_time');
            ytInitialPlayerResponse_value = value;
        },
        configurable: false
    });

    let ytInitialReelWatchSequenceResponse_value = unsafeWindow['ytInitialReelWatchSequenceResponse'];
    define_property_hook(unsafeWindow, 'ytInitialReelWatchSequenceResponse', {
        get: function () {
            return ytInitialReelWatchSequenceResponse_value;
        },
        set: function (value) {
            inject_info.ytInitialReelWatchSequenceResponse = true;
            if (page_type.endsWith('_shorts')) {
                if (value && open_debugger) debugger_ytInitialReelWatchSequenceResponse = (typeof (value) === 'string') ? JSON.parse(value) : JSON.parse(JSON.stringify(value));
                let start_time = Date.now();
                value && data_process.obj_process(value, ytInitialReelWatchSequenceResponse_rule, true);
                log('ytInitialReelWatchSequenceResponse 时间：', Date.now() - start_time, 'spend_time');
            }
            ytInitialReelWatchSequenceResponse_value = value;
        },
        configurable: false
    });

    let ytInitialData_value = unsafeWindow['ytInitialData'];
    define_property_hook(unsafeWindow, 'ytInitialData', {
        get: function () {
            return ytInitialData_value;
        },
        set: function (value) {
            inject_info.ytInitialData = true;
            if (typeof (value) === 'string') {
                ytInitialData_value = value;
                return;
            }
            if (open_debugger && value !== undefined && value !== null) debugger_ytInitialData = JSON.parse(JSON.stringify(value));
            if (ytInitialData_rule) {
                let start_time = Date.now();
                value && data_process.obj_process(value, ytInitialData_rule, true);
                log('ytInitialData 时间：', Date.now() - start_time, 'spend_time');
            }
            ytInitialData_value = value;
        },
        configurable: false
    });

    define_property_hook(navigator, 'userAgent', {
        get: function () {
            return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36';
        }
    });

    let origin_createElement = document.createElement;
    document.createElement = function () {
        let node = origin_createElement.apply(this, arguments);
        if (arguments[0] === 'template') {
            let innerhtml_getter = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML").get;
            let innerhtml_setter = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML").set;
            define_property_hook(node, 'innerHTML', {
                get: function () {
                    return innerhtml_getter.call(node);
                },
                set: function (value) {
                    // if (value.toString().includes('ytd-continuation-item-renderer')){
                    //     if (href.includes('https://www.youtube.com/watch')){
                    //         value = ''
                    //         log(value);
                    //         log('弹窗去掉------->ytd-continuation-item-renderer');
                    // }
                    if (value.toString().includes('yt-mealbar-promo-renderer')) {
                        log('弹窗去掉------->yt-mealbar-promo-renderer', 'node_process');
                        value = '';
                    }
                    innerhtml_setter.call(node, value);
                }
            });
        }
        return node;
    };
    document.createElement.toString = origin_createElement.toString.bind(origin_createElement);

    async function deal_response(name, response, rule) {
        if (!rule) return null;
        try {
            let is_deal = false;
            const responseClone = response.clone();
            let result = await responseClone.text();
            let orgin_result = result;
            if (name === 'subscribe' || name === 'unsubscribe') {
                let match_list = result.match(/channelId":\"(.*?)"/);
                const match_channel_id = match_list && match_list.length > 1 ? match_list[1] : '';
                let channel_infos = user_data.channel_infos;
                if (match_channel_id) {
                    if (name === 'unsubscribe') {
                        let index = channel_infos.ids.indexOf(match_channel_id);
                        if (index > -1) {
                            channel_infos.ids.splice(index, 1);
                            channel_infos.names.splice(index, 1);
                        }
                    } else {
                        channel_infos.ids.push(match_channel_id);
                        channel_infos.names.push('');
                    }
                    user_data.channel_infos = channel_infos;
                    store_user_data();
                }
                is_deal = true;
            }
            if (!is_deal) {
                let start_time = Date.now();
                result = data_process.text_process(result, rule, 'insert', true);
                log(name + ' 时间：', Date.now() - start_time, 'spend_time');
            }
            if (!result) {
                result = orgin_result;
                debugger;
            }
            return new Response(result, response);
        } catch (e) {
            console.warn(e);
        }
        return null;
    }
    const origin_fetch = unsafeWindow.fetch;
    if (origin_fetch.toString() !== 'function fetch() { [native code] }') {
        log('fetch have been modified', -1);
    }
    unsafeWindow.fetch = function () {
        const fetch_ = async function (uri, options) {
            async function fetch_request(response) {
                const url = response.url;
                inject_info.fetch = true;
                // return_response = response;
                if (url.includes('youtubei/v1/next')) {
                    if (!page_type.endsWith('_watch')) return response;
                    return (await deal_response('next', response, ytInitialData_rule)) || response;
                }
                if (url.includes('youtubei/v1/player')) {
                    if (!page_type.endsWith('_home') && !page_type.endsWith('_watch')) return response;
                    return (await deal_response('player', response, ytInitialPlayerResponse_rule)) || response;
                }
                if (url.includes('youtubei/v1/reel/reel_watch_sequence')) {
                    // shorts 内容列表
                    return (await deal_response('reel_watch_sequence', response, ytInitialReelWatchSequenceResponse_rule)) || response;
                }
                if (url.includes('youtubei/v1/reel/reel_item_watch')) {
                    // shorts 内容
                    if (!['yt_shorts', 'mobile_yt_shorts'].includes(page_type)) return response;
                    return (await deal_response('reel_item_watch', response, ytInitialData_rule)) || response;
                }
                if (url.includes('youtubei/v1/browse')) {
                    let rule = ytInitialData_rule;
                    if (page_type.endsWith('_home') && ['off', 'subscribed'].includes(user_data.open_recommend_liveroom)) {
                        let node, category_text;
                        if (mobile_web) {
                            node = document.querySelector('#filter-chip-bar > div > ytm-chip-cloud-chip-renderer.selected');
                            category_text = node && node.textContent;
                        } else {
                            node = document.querySelector('#chips > yt-chip-cloud-chip-renderer.style-scope.ytd-feed-filter-chip-bar-renderer.iron-selected');
                            category_text = node && node.querySelector('#text').textContent;
                        }
                        const filter_list = [flag_info.category_game, flag_info.category_live, flag_info.category_news];
                        if (filter_list.includes(category_text)) {
                            let body;
                            if (uri.body_) {
                                try {
                                    body = JSON.parse(uri.body_);
                                } catch (error) {
                                }
                            }
                            if (!body || body.browseId !== 'FEwhat_to_watch') {
                                rule = ytInitialData_rule.filter(item => !item.includes(flag_info.live));
                            }
                        }
                    }
                    return (await deal_response('browse', response, rule)) || response;
                }
                if (url.includes('https://m.youtube.com/youtubei/v1/guide')) {
                    return (await deal_response('guide', response, ytInitialData_rule)) || response;
                }
                if (url.includes('/youtubei/v1/search')) {
                    return (await deal_response('search', response, ytInitialData_rule)) || response;
                }
                if (url.includes('/unsubscribe?prettyPrint=false')) {
                    return (await deal_response('unsubscribe', response)) || response;
                }
                if (url.includes('/subscribe?prettyPrint=false')) {
                    return (await deal_response('subscribe', response)) || response;
                }
                return response;
            }

            return origin_fetch(uri, options).then(fetch_request);
        };
        const names = Object.getOwnPropertyNames(origin_fetch);
        for (let i = 0; i < names.length; i++) {
            if (names[i] in fetch_)
                continue;
            let desc = Object.getOwnPropertyDescriptor(origin_fetch, names[i]);
            define_property_hook(fetch_, names[i], desc);
        }
        return fetch_;
    }();
    const origin_Request = unsafeWindow.Request;

    if (origin_Request.toString() !== 'function Request() { [native code] }') {
        log('Request have been modified', -1);
    }

    unsafeWindow.Request = class extends unsafeWindow.Request {
        constructor(input, options = void 0) {
            super(input, options);
            if (options && 'body' in options) this['body_'] = options['body'];
        }
    };

    const textToObject = (txt)=>{
        let obj = null;
        if(typeof txt ==='string'){
            try {
                obj = JSON.parse(txt);
            } catch (error) {
                log('JSON解析失败', 1);
            }
            
        }else if (typeof txt === 'object'){
            obj = txt;
        }
        return obj;
    }

    unsafeWindow.XMLHttpRequest = class extends unsafeWindow.XMLHttpRequest {
        open(method, url, ...opts) {
            inject_info.xhr = true;
            return super.open(method, url, ...opts);
        }
        processResult(result) {
            try {
                const xhr = this;
                const resURL = xhr.responseURL || '';
                if (resURL.includes('youtubei/v1/player')) {
                    // music_watch
                    if (typeof result === 'string') {
                        result = data_process.text_process(result, ytInitialPlayerResponse_rule, 'insert', true);
                    }
                } else if (resURL.includes('youtube.com/playlist')) {
                    const obj = textToObject(result);
                    if (obj && obj.length >= 4) {
                        data_process.obj_process(obj[2].playerResponse, ytInitialPlayerResponse_rule, true);
                        data_process.obj_process(obj[3].response, ytInitialData_rule, true);
                        tmp_debugger_value = obj;
                        if (typeof result === 'string') result = JSON.stringify(obj);
                        else if (typeof result === 'object') result = obj;
                    }
                }
            } catch (e) {
                console.warn(e);
            }
            return result;
        }
        get responseText() {
            let result = super.responseText;
            if (super.readyState === XMLHttpRequest.DONE) {
                result = this.processResult(result);
            }
            return result;
        }
        get response() {
            let result = super.response;
            if (super.readyState === XMLHttpRequest.DONE) {
                result = this.processResult(result);
            }
            return result;
        }
    };


    document.addEventListener('DOMContentLoaded', function () {
        !mobile_web && search_listener();
        checke_update();
    });

    if (unsafeWindow.ytcfg) {
        if (unsafeWindow.ytcfg.data_ && typeof (unsafeWindow.ytcfg.data_.LOGGED_IN) === 'boolean') {
            unsafeWindow.ytcfg.data_.LOGGED_IN === true && account_data_init();
        } else {
            if (unsafeWindow.ytcfg.data_ && typeof unsafeWindow.ytcfg.data_ === 'object') {
                define_property_hook(unsafeWindow.ytcfg.data_, 'LOGGED_IN', {
                    get: function () {
                        return unsafeWindow.ytcfg.data_.LOGGED_IN_;
                    },
                    set: function (value) {
                        unsafeWindow.ytcfg.data_.LOGGED_IN_ = value;
                        value === true && account_data_init();
                    }
                });
            }
        }
        if (!unsafeWindow.ytcfg.data_) {
            if (unsafeWindow.yt && unsafeWindow.yt.config_) {
                const config_ = unsafeWindow.yt.config_;
                if (typeof (config_.LOGGED_IN) === 'boolean') {
                    config_.LOGGED_IN === true && account_data_init();
                }
                config_.HL && config_init(config_.HL);
            }
        }
        if (unsafeWindow.ytcfg.data_ && unsafeWindow.ytcfg.data_.HL) config_init(unsafeWindow.ytcfg.data_.HL);
        !(unsafeWindow.ytcfg.data_ && unsafeWindow.ytcfg.data_.HL) && define_property_hook(unsafeWindow.ytcfg, 'msgs', {
            get: function () {
                return this._msgs;
            },
            set: function (newValue) {
                if (newValue.__lang__) config_init(newValue.__lang__);
                this._msgs = newValue;
            }
        });
    } else {
        define_property_hook(unsafeWindow, 'ytcfg', {
            get: function () {
                return this._ytcfg;
            },
            set: function (newValue) {
                if (newValue.set) {
                    const orgin_set = newValue.set;
                    newValue.set = function () {
                        orgin_set.apply(this, arguments);
                        if (arguments[0] && typeof arguments[0].LOGGED_IN === 'boolean') {
                            arguments[0].LOGGED_IN === true && account_data_init();
                        }
                        if (arguments[0].HL) {
                            config_init(arguments[0].HL);
                        }
                    };
                }
                this._ytcfg = newValue;
            }
        });
    }
    isinint = true;
    log('初始化结束！', 0);
}

async function account_data_init() {
    if (is_account_init) return;
    is_account_init = true;
    yt_api.get_channel_id();
    yt_api.get_subscribe_data();
}

function native_method_hook(method_path, handler) {
    let [last_path, last_key] = data_process.get_lastPath_and_key(method_path);
    let last_obj = data_process.string_to_value(unsafeWindow, 'unsafeWindow.' + last_path);
    let dec_obj = last_obj[last_key];
    last_obj[last_key + '__'] = dec_obj;
    if (typeof dec_obj !== 'function') {
        log(method_path, 'have been modified', -1);
        return;
    }
    const method_name = dec_obj.name;
    if (dec_obj.toString() !== 'function ' + method_name + '() { [native code] }') {
        log(method_path, 'have been modified！', -1);
    }
    last_obj[last_key] = handler;
}

function define_property_hook(obj, property, descriptor) {
    try {
        Object.defineProperty(obj, property, descriptor);
    } catch (error) {
        log("hook " + property + " failed！", -1);
        return;
    }
    if (descriptor.get) {
        const get_ = Object.getOwnPropertyDescriptor(obj, property).get;
        if (descriptor.get !== get_) {
            log("hook " + property + " failed！", -1);
            return;
        }
    }
    if (descriptor.set) {
        const set_ = Object.getOwnPropertyDescriptor(obj, property).set;
        if (descriptor.set !== set_)
            log("hook " + property + " failed！", -1);
    }
}

function config_init(tmp_language = null) {
    if (isinint) {
        setTimeout(search_listener, 500);
    }
    if (!tmp_language) {
        tmp_language = unsafeWindow['ytcfg'].msgs ? unsafeWindow['ytcfg'].msgs.__lang__ : (unsafeWindow['ytcfg'].data ? unsafeWindow['ytcfg'].data.HL : undefined);
        !tmp_language && (tmp_language = unsafeWindow['yt'] && unsafeWindow['yt'].config_ && unsafeWindow['yt'].config_.HL);
        if (!tmp_language) {
            log('语言获取错误', unsafeWindow, -1);
            tmp_language = 'zh-CN';
        }
    }
    if (!['zh-CN', 'zh-TW', 'zh-HK', 'en'].includes(tmp_language)) {
        log(`Does not support language ${tmp_language}, only supports zh-CN, zh-TW, zh-HK, en, and is compatible with English locations; there may be some errors.`, -1);
        tmp_language = tmp_language.startsWith('en-') ? 'en' : 'zh-CN';
    }
    let flag_infos = {
        "zh-CN": {
            "sponsored": "赞助商广告",
            "free_movie": "免费（含广告）",
            "live": "直播",
            "movie_channel": "影视",
            "free_primetime_movie": "免费 Primetime 电影",
            "Playables": "游戏大本营",
            "think_video": "你对这个视频有何看法？|此推荐内容怎么样？",
            "try": "试用",
            "recommend_popular": "时下流行",
            "featured": "Featured",
            "category_live": "直播",
            "category_game": "游戏",
            "category_news": "新闻",
            "btn_recommend_movie": "电影推荐",
            "btn_recommend_shorts": "Shorts推荐",
            "btn_recommend_liveroom": "直播推荐",
            "btn_recommend_popular": "时下流行",
            "btn_recommend_game": "游戏大本营推荐",
            "btn_save": "保存",
            "goodselect": "精选",
            "music_ad_flag": "无广告打扰",
            "upcoming": "即将开始",
            "init": "初始化",
            "ctoc": "已复制到剪贴板",
            "runing_normally": "运行正常",
            "err_msg": "错误信息",
            "success": "成功",
            "failed": "失败",
            "tips": "你可以发送错误信息或者截图发给脚本开发者",
            "exists_error": "存在错误信息(建议多次刷新观察是否是同样的错误信息)",
            "inject": "注入",
            "btn_lable_open": "开启",
            "btn_lable_close": "关闭",
            "btn_lable_subscribed": "仅订阅",
            "recommend_subscribed_lable_tips": "只显示已订阅的推荐",
            "title_add_shorts_upload_date": "Shorts添加更新时间",
            "title_shorts_change_author_name": "Shorts用户名改频道名",
        },
        "zh-TW": {
            "sponsored": "贊助商廣告",
            "free_movie": "免費 \\(含廣告\\)",
            "live": "直播",
            "movie_channel": "電影與電視節目",
            "Playables": "遊戲角落",
            "free_primetime_movie": "免費的特選電影",
            "think_video": "你對這部影片有什麼看法？|此推荐内容怎么样？",
            "try": "試用",
            "recommend_popular": "發燒影片",
            "featured": "Featured",
            "category_live": "直播中",
            "category_game": "遊戲",
            "category_news": "新聞",
            "btn_recommend_movie": "电影推薦",
            "btn_recommend_shorts": "Shorts推薦",
            "btn_recommend_liveroom": "直播推薦",
            "btn_recommend_popular": "發燒影片",
            "btn_recommend_game": "遊戲角落推薦",
            "btn_save": "保存",
            "goodselect": "精選內容",
            "music_ad_flag": "零廣告",
            "upcoming": "即将直播",
            "init": "初始化",
            "ctoc": "已複製到剪貼板",
            "runing_normally": "運行正常",
            "err_msg": "錯誤訊息",
            "success": "成功",
            "failed": "失敗",
            "tips": "你可以发送錯誤訊息或截圖給腳本開發者",
            "exists_error": "存在錯誤訊息（建議多次刷新觀察是否是同樣的錯誤訊息）",
            "inject": "注入",
            "btn_lable_open": "開啓",
            "btn_lable_close": "關閉",
            "btn_lable_subscribed": "僅訂閱",
            "recommend_subscribed_lable_tips": "只顯示已訂閱的推薦",
            "title_add_shorts_upload_date": "Shorts添加更新時間",
            "title_shorts_change_author_name": "Shorts用戶名稱改頻道名",
        },
        "zh-HK": {
            "sponsored": "赞助",
            "free_movie": "免費 \\(有廣告\\)",
            "live": "直播",
            "movie_channel": "電影與電視節目",
            "Playables": "Playables",
            "free_primetime_movie": "黃金時段電影",
            "think_video": "你對此影片有何意見？|此推荐内容怎么样？",
            "try": "試用",
            "recommend_popular": "熱爆影片",
            "featured": "Featured",
            "category_live": "直播",
            "category_game": "遊戲",
            "category_news": "新聞",
            "btn_recommend_movie": "电影推薦",
            "btn_recommend_shorts": "Shorts推薦",
            "btn_recommend_liveroom": "直播推薦",
            "btn_recommend_popular": "熱爆影片",
            "btn_recommend_game": "Playables推荐",
            "btn_save": "保存",
            "goodselect": "精選內容",
            "music_ad_flag": "零廣告音樂",
            "upcoming": "即將發佈",
            "init": "初始化",
            "ctoc": "已複製到剪貼板",
            "runing_normally": "運行正常",
            "err_msg": "錯誤訊息",
            "success": "成功",
            "failed": "失敗",
            "tips": "你可以发送錯誤訊息或截圖給腳本開發者",
            "exists_error": "存在錯誤訊息（建議多次刷新觀察是否是同樣的錯誤訊息）",
            "inject": "注入",
            "btn_lable_open": "開啓",
            "btn_lable_close": "關閉",
            "btn_lable_subscribed": "僅訂閱",
            "recommend_subscribed_lable_tips": "只顯示已訂閱的推薦",
            "title_add_shorts_upload_date": "Shorts添加更新時間",
            "title_shorts_change_author_name": "Shorts用戶名稱改頻道名",
        },
        "en": {
            "sponsored": "Sponsored",
            "free_movie": "Free with ads",
            "live": "LIVE",
            "movie_channel": "Movies & TV",
            "Playables": "Playables",
            "free_primetime_movie": "Free Primetime movies",
            "think_video": "What did you think of this video?|此推荐内容怎么样？",
            "try": "Try",
            "recommend_popular": "Trending",
            "featured": "Featured",
            "category_live": "Live",
            "category_game": "Gaming",
            "category_news": "News",
            "btn_recommend_movie": "MovieRecommend",
            "btn_recommend_shorts": "ShortsRecommend",
            "btn_recommend_liveroom": "LiveRecommend",
            "btn_recommend_popular": "TrendingRecommend",
            "btn_recommend_game": "PlayablesRecommend",
            "btn_save": "Save",
            "goodselect": "Featured",
            "music_ad_flag": "ad-free",
            "upcoming": "UPCOMING",
            "init": "init",
            "ctoc": "Copied to clipboard",
            "runing_normally": "running normally",
            "err_msg": "error message",
            "success": "success",
            "failed": "failed",
            "tips": "You can send error message or screenshot to the developer",
            "exists_error": "Error message exists (It is recommended to refresh multiple times to see if it is the same error message)",
            "inject": "inject",
            "btn_lable_open": "on",
            "btn_lable_close": "off",
            "btn_lable_subscribed": "onlySubscribed",
            "recommend_subscribed_lable_tips": "only show subscribed recommend",
            "title_add_shorts_upload_date": "ShortsAddUploadTime",
            "title_shorts_change_author_name": "ShortsChangeToChannelName",
        }
    };
    if (tmp_language !== user_data.language) {
        user_data.language = tmp_language;
        user_data_api.set();
    }

    flag_info = flag_infos[user_data.language];
    movie_channel_info = {
        "guideEntryRenderer": {
            "navigationEndpoint": {
                "clickTrackingParams": "CBQQnOQDGAIiEwj5l8SLqPiCAxUXSEwIHbf1Dw0=",
                "commandMetadata": {
                    "webCommandMetadata": {
                        "url": "/feed/storefront",
                        "webPageType": "WEB_PAGE_TYPE_BROWSE",
                        "rootVe": 6827,
                        "apiUrl": "/youtubei/v1/browse"
                    }
                },
                "browseEndpoint": {
                    "browseId": "FEstorefront"
                }
            },
            "icon": {
                "iconType": "CLAPPERBOARD"
            },
            "trackingParams": "CBQQnOQDGAIiEwj5l8SLqPiCAxUXSEwIHbf1Dw0=",
            "formattedTitle": {
                "simpleText": flag_info.movie_channel
            },
            "accessibility": {
                "accessibilityData": {
                    "label": flag_info.movie_channel
                }
            }
        }
    };
    unsafeWindow.movie_channel_info = movie_channel_info;
    mobile_movie_channel_info = {
        "navigationItemViewModel": {
            "text": {
                "content": flag_info.movie_channel
            },
            "icon": {
                "sources": [
                    {
                        "clientResource": {
                            "imageName": "CLAPPERBOARD"
                        }
                    }
                ]
            },
            "onTap": {
                "parallelCommand": {
                    "commands": [
                        {
                            "innertubeCommand": {
                                "clickTrackingParams": "CBQQnOQDGAIiEwj5l8SLqPiCAxUXSEwIHbf1Dw0=",
                                "hideMoreDrawerCommand": {}
                            }
                        },
                        {
                            "innertubeCommand": {
                                "clickTrackingParams": "CBQQnOQDGAIiEwj5l8SLqPiCAxUXSEwIHbf1Dw0=",
                                "commandMetadata": {
                                    "webCommandMetadata": {
                                        "url": "/feed/storefront",
                                        "webPageType": "WEB_PAGE_TYPE_CHANNEL",
                                        "rootVe": 3611,
                                        "apiUrl": "/youtubei/v1/browse"
                                    }
                                },
                                "browseEndpoint": {
                                    "browseId": "FEstorefront"
                                }
                            }
                        }
                    ]
                }
            },
            "loggingDirectives": {
                "trackingParams": "CBQQnOQDGAIiEwj5l8SLqPiCAxUXSEwIHbf1Dw0=",
                "visibility": {
                    "types": "12"
                },
                "enableDisplayloggerExperiment": true
            }
        }
    };
    unsafeWindow.mobile_movie_channel_info = mobile_movie_channel_info;
    ytInitialData_rule = null;
    ytInitialReelWatchSequenceResponse_rule = null;
    ytInitialPlayerResponse_rule = null;
    mobile_web = page_type.includes('mobile');
    const common_ytInitialData_rule = [
        'tvfilmOfferModuleRenderer=- /.masthead$exist',
        'merchandiseShelfRenderer=-',
        'adSlotRenderer.=-',
    ];
    const common_ytInitialPlayerResponse_rule = [
        "abs:playerAds=-",
        "abs:adPlacements=-",
        "abs:adBreakHeartbeatParams=-",
        "abs:adSlots=-",
        "abs:streamingData.serverAbrStreamingUrl=-"
    ];
    if (page_type === 'yt_search') {
        ytInitialPlayerResponse_rule = common_ytInitialPlayerResponse_rule;
        ytInitialData_rule = common_ytInitialData_rule;
        return;
    }
    if (page_type === 'mobile_yt_search') {
        ytInitialData_rule = common_ytInitialData_rule;
        return;
    }
    if (page_type === 'yt_kids_watch') {
        ytInitialData_rule = common_ytInitialData_rule;
        return;
    }

    if (page_type === 'yt_music_watch') {
        ytInitialPlayerResponse_rule = common_ytInitialPlayerResponse_rule;
        ytInitialData_rule = common_ytInitialData_rule;
        return;
    }

    if (page_type.includes('yt_shorts')) {
        ytInitialReelWatchSequenceResponse_rule = ['abs:entries[*]=- /.command.reelWatchEndpoint.adClientParams$exist'];
        return;
    }

    if (page_type.includes('yt_watch')) {
        const watch_page_ytInitialData_rule = common_ytInitialData_rule;

        let lower_left_corner_tags;
        let lower_left_corner_rule = mobile_web ? 'metadataBadgeRenderer.label.....=- ~=' : 'metadataBadgeRenderer.label.....=- ~=';
        lower_left_corner_tags = [];
        //赞助商广告
        lower_left_corner_tags.push(flag_info.sponsored);
        //免费电影
        user_data.open_recommend_movie === 'off' && lower_left_corner_tags.push(flag_info.free_movie);
        lower_left_corner_rule += lower_left_corner_tags.join('|');
        watch_page_ytInitialData_rule.push(lower_left_corner_rule);

        let live_rules;
        //直播规则
        if (['off', 'subscribed'].includes(user_data.open_recommend_liveroom)) {
            live_rules = ['text.accessibility.accessibilityData.label........=- =' + flag_info.live];
            !mobile_web && live_rules.push('metadataBadgeRenderer.label.....=- =' + flag_info.live);
        }
        live_rules && watch_page_ytInitialData_rule.push(...live_rules);

        // 大标题栏目 短视频等
        let recommend_rules = [];
        let recommend_tags = [];
        let recommend_base_rule = 'reelShelfRenderer.title.runs[0].text.....=- ~=';
        ['off', 'subscribed'].includes(user_data.open_recommend_shorts) && recommend_tags.push('Shorts');
        if (recommend_tags.length > 0 && !mobile_web) {
            recommend_rules.push(recommend_base_rule + recommend_tags.join('|'));
        }
        recommend_rules.length && watch_page_ytInitialData_rule.push(...recommend_rules);

        // 添加已订阅短视频
        let subscribed_shorts_rule;
        if (user_data.open_recommend_shorts === 'subscribed') {
            subscribed_shorts_rule = 'secondaryResults.results[1].itemSectionRenderer.contents=+(arr_insert,method(shorts_fun.get_shorts_section()),0) @user_data.shorts_list.length$value>0';
        }
        subscribed_shorts_rule && watch_page_ytInitialData_rule.push(subscribed_shorts_rule);

        // 视频下方可能会出现的推荐栏目
        !mobile_web && watch_page_ytInitialData_rule.push("metadataRowContainer=-");

        ytInitialData_rule = watch_page_ytInitialData_rule;

        ytInitialPlayerResponse_rule = common_ytInitialPlayerResponse_rule;
        return;
    }

    if (page_type.includes('yt_home')) {
        let home_page_ytInitialData_ad_rule = [
            'richItemRenderer.content.adSlotRenderer..=-'
        ];
        // 每一个item左下角标签
        let left_corner_tags;
        let lower_left_corner_rule = mobile_web ? 'metadataBadgeRenderer.label.....=- ~=' : 'metadataBadgeRenderer.label......=- ~=';
        left_corner_tags = [];
        //赞助商广告
        left_corner_tags.push(flag_info.sponsored);
        //免费电影
        user_data.open_recommend_movie === 'off' && left_corner_tags.push(flag_info.free_movie);
        lower_left_corner_rule += left_corner_tags.join('|');
        home_page_ytInitialData_ad_rule.push(lower_left_corner_rule);

        //头部第一个广告
        let head_ad = 'richGridRenderer.masthead=-';
        home_page_ytInitialData_ad_rule.push(head_ad);

        //大标题栏目 短视频 电影等
        let recommend_rules = [];
        let recommend_tags = [];
        let recommend_base_rule = mobile_web ? 'reelShelfRenderer.title.runs[0].text.......=- ~=' : 'richShelfRenderer.title.runs[0].text......=- ~=';
        ['off', 'subscribed'].includes(user_data.open_recommend_shorts) && recommend_tags.push('Shorts');
        user_data.open_recommend_movie === 'off' && recommend_tags.push(flag_info.free_primetime_movie);
        user_data.open_recommend_popular === 'off' && recommend_tags.push(flag_info.recommend_popular);
        user_data.open_recommend_playables === 'off' && recommend_tags.push(flag_info.Playables);
        if (recommend_tags.length > 0) {
            recommend_rules.push(recommend_base_rule + recommend_tags.join('|'));
        }
        recommend_rules.length && home_page_ytInitialData_ad_rule.push(...recommend_rules);

        //直播规则
        let live_rules;
        if (['off', 'subscribed'].includes(user_data.open_recommend_liveroom)) {
            live_rules = ['text.accessibility.accessibilityData.label........=- =' + flag_info.live];
            if (!mobile_web) {
                live_rules.push('metadataBadgeRenderer.label......=- =' + flag_info.live);
                live_rules.push('thumbnailOverlayTimeStatusRenderer.text.simpleText.......=- =' + flag_info.upcoming);
            } else {
                live_rules.push('thumbnailOverlayTimeStatusRenderer.text.runs[0].text.........=- =' + flag_info.upcoming);
            }
        }
        live_rules && home_page_ytInitialData_ad_rule.push(...live_rules);

        //添加电影频道
        let add_movie_channel_rule = "loadingStrategy.inlineContent.moreDrawerViewModel.content=+obj(" + (mobile_web ? "mobile_" : "") + "movie_channel_info) !~=" + flag_info.movie_channel;
        home_page_ytInitialData_ad_rule.push(add_movie_channel_rule);

        // 音乐会员
        let music_premium_ad_rule;
        !mobile_web && (music_premium_ad_rule = 'richSectionRenderer.content.statementBannerRenderer.title.runs[0].text.......=- ~=Music Premium|' + flag_info.music_ad_flag);
        music_premium_ad_rule && home_page_ytInitialData_ad_rule.push(music_premium_ad_rule);

        //电视好物
        let tv_goodselect_rule;
        open_recommend_tv_goodselect === 'off' && (tv_goodselect_rule = 'metadataBadgeRenderer.label........=- ~=' + flag_info.goodselect);
        tv_goodselect_rule && home_page_ytInitialData_ad_rule.push(tv_goodselect_rule);

        //弹窗
        let popup_window_rules = ['title.runs[0].text......=- ~=YouTube Premium|' + flag_info.think_video,
        'videoOwnerRenderer=- /.purchaseButton.buttonRenderer.text.simpleText~=' + flag_info.try];
        home_page_ytInitialData_ad_rule.push(...popup_window_rules);

        // 特色推荐
        let featured_rules;
        if (open_recommend_featured === 'off') {
            featured_rules = [];
            featured_rules.push('brandVideoSingletonRenderer.badgeText.runs[0].text.......=- ~=' + flag_info.featured);
            featured_rules.push('brandVideoShelfRenderer.badgeText.runs[0].text.......=- ~=' + flag_info.featured);
            featured_rules.push('bigYoodle.statementBannerRenderer.badgeText.runs[0].text.....=- =' + flag_info.featured);
        }
        featured_rules && home_page_ytInitialData_ad_rule.push(...featured_rules);

        // 添加已订阅短视频
        let subscribed_shorts_rule;
        if (user_data.open_recommend_shorts === 'subscribed') {
            subscribed_shorts_rule = 'tabs[0].tabRenderer.content.richGridRenderer.contents=+(arr_insert,method(shorts_fun.get_shorts_section()),0) @user_data.shorts_list.length$value>0';
        }
        subscribed_shorts_rule && home_page_ytInitialData_ad_rule.push(subscribed_shorts_rule);
        ytInitialData_rule = home_page_ytInitialData_ad_rule;

        ytInitialPlayerResponse_rule = common_ytInitialPlayerResponse_rule;
        return;
    }
}

function search_listener() {
    const search_selector = href.includes('https://m.youtube.com/') ? 'input.searchbox-input.title' : 'input[id="search"]';
    const search_input_node = document.querySelector(search_selector);
    if (search_input_node) {
        search_input_node.oninput = function (event) {
            if (open_config_keyword === this.value || this.value === display_error_keyword) {
                setTimeout(function () {
                    if (search_input_node.value === open_config_keyword) {
                        search_input_node.value = '';
                        user_data_api.getLatestValues(user_data);
                        display_config_win();
                    }
                    if (search_input_node.value === display_error_keyword) {
                        search_input_node.value = '';
                        let tips = `script ${flag_info.init} ${isinint ? flag_info.success : flag_info.failed}`;
                        if (error_messages.length === 0 && isinint) tips += ' ' + flag_info.runing_normally;
                        for (let key of Object.keys(inject_info)) {
                            if (!mobile_web && key === 'ytInitialPlayerResponse') continue;
                            if (key === 'ytInitialReelWatchSequenceResponse' && !/yt_shorts$/.test(page_type)) continue;
                            tips += `\n${key} ${flag_info.inject} ${inject_info[key] ? flag_info.success : flag_info.failed}`;
                        }
                        if (error_messages.length !== 0) {
                            tips += `\n\n${flag_info.exists_error}\n-----------${flag_info.err_msg}(${flag_info.ctoc})-----------------\n${error_messages.join('\n')}\n\n${flag_info.tips}`;
                        }
                        alert(tips);
                        if (error_messages.length > 0) {
                            copyToClipboard(error_messages.join('\n'));
                        }
                    }
                }, 500);
            }
        };
    }
}

function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
        const cookie = cookieArray[i].trim();

        if (cookie.startsWith(name)) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function url_observer() {
    if (unsafeWindow.navigation) {
        unsafeWindow.navigation.addEventListener('navigate', (event) => {
            url_change(event);
        }, true);
        return;
    }
    const _historyWrap = function (type) {
        const orig = unsafeWindow.history[type];
        const e = new Event(type);
        return function () {
            const rv = orig.apply(this, arguments);
            try {
                e.arguments = arguments;
                unsafeWindow.dispatchEvent(e);
            } catch (err) { }
            return rv;
        };
    };
    unsafeWindow.history.pushState = _historyWrap('pushState');
    unsafeWindow.history.replaceState = _historyWrap('replaceState');
    unsafeWindow.addEventListener('replaceState', function (event) {
        url_change(event);
    }, true);
    unsafeWindow.addEventListener('pushState', function (event) {
        url_change(event);
    }, true);
    unsafeWindow.addEventListener('popstate', function (event) {
        url_change(event);
    }, true);
    unsafeWindow.addEventListener('hashchange', function (event) {
        url_change(event);
    }, true);
}

function url_change(event = null) {
    try {
        const destination_url = event?.destination?.url || '';
        if (destination_url.startsWith('about:blank')) return;
        href = destination_url || location.href;
        log('网页url改变 href -> ' + href, 0);
        let tmp_page_type = get_page_type();
        if (tmp_page_type === 'yt_shorts') {
            shorts_fun.check_shorts_exist();
        }
        if (tmp_page_type !== page_type) {
            page_type = tmp_page_type;
            config_init();
        }
    } catch (e) {
        console.warn(e);
    }
}

function get_page_type() {
    let tmp_page_type;
    const uo = new URL(href);
    const isDesktop = (uo.hostname === 'www.youtube.com');
    const isMobile = (uo.hostname === 'm.youtube.com');
    const isKids = (uo.hostname === 'www.youtubekids.com');
    const isMusic = (uo.hostname === 'music.youtube.com');
    if (isDesktop && uo.pathname === '/') tmp_page_type = 'yt_home';
    else if (isMobile && uo.pathname === '/') tmp_page_type = 'mobile_yt_home';
    else if (isDesktop && uo.pathname === '/watch') tmp_page_type = 'yt_watch';
    else if (isMobile && uo.pathname === '/watch') tmp_page_type = 'mobile_yt_watch';
    else if (isDesktop && uo.pathname === '/results') tmp_page_type = 'yt_search';
    else if (isMobile && uo.pathname === '/results') tmp_page_type = 'mobile_yt_search';
    else if (isDesktop && uo.pathname === '/shorts') tmp_page_type = 'yt_shorts';
    else if (isMobile && uo.pathname === '/shorts') tmp_page_type = 'mobile_yt_shorts';
    else if (isKids && uo.pathname === '/watch') tmp_page_type = 'yt_kids_watch';
    else if (isMusic && uo.pathname === '/') tmp_page_type = 'yt_music_home';
    else if (isMusic && uo.pathname === '/watch') tmp_page_type = 'yt_music_watch';
    else tmp_page_type = 'other';
    return tmp_page_type;
}
function set_debugger() {
    const debugger_config_info = {
        'ytInitialPlayerResponse': debugger_ytInitialPlayerResponse,
        'ytInitialData': debugger_ytInitialData,
        'ytInitialReelWatchSequenceResponse': debugger_ytInitialReelWatchSequenceResponse,
        'inject_info': inject_info,
        'info': [
            'ytInitialData_rule',
            'ytInitialPlayerResponse_rule',
            'is_account_init',
            'user_data',
            'mobile_web',
            'page_type',
            'tmp_debugger_value',
        ],
    };

    unsafeWindow.debugger_ = function (action = null) {
        let keys = Object.keys(debugger_config_info);
        if (!action && action !== 0) { debugger; return; }
        if (action === 'ytInitialPlayerResponse') log('ytInitialPlayerResponse', debugger_ytInitialPlayerResponse, 0);
        if (action === 'ytInitialData') log('ytInitialData', debugger_ytInitialData, 0);
        if (action === 'inject_info') log('inject_info', inject_info, 0);
        if (action === 'info') {
            if (limit_eval) {
                log('eval限制使用了', 0);
            } else {
                for (let key of debugger_config_info['info']) {
                    log(key, eval(key), 0);
                }
            }
            return;
        }
        if (action === 'list') {
            keys.forEach(function (key, index) {
                log(index, key, 0);
            });
        }
        if (typeof (action) === 'number') {
            if (action < keys.length) {
                unsafeWindow.debugger_(keys[action]);
            } else if (action >= keys.length) {
                keys.forEach(function (key) {
                    unsafeWindow.debugger_(key);
                });
            }

        }
    };
}

function log() {
    const arguments_arr = [...arguments];
    const flag = arguments_arr.pop();
    if (flag === -1) {
        error_messages.push(arguments_arr.join(' '));
    }
    if (flag === 999) arguments_arr.unshift('-----test---test-----');
    if (flag !== 0 && flag !== 999) arguments_arr.push(getCodeLocation());
    if (flag === 0 || open_debugger) flag === -1 ? orgin_console.error(...arguments_arr) : orgin_console.log(...arguments_arr);
}

function getCodeLocation() {
    const callstack = new Error().stack.split("\n");
    callstack.shift();
    while (callstack.length && callstack[0].includes("-extension://")) {
        callstack.shift();
    }
    if (!callstack.length) {
        return "";
    }
    return '\n' + callstack[0].trim();
}

function display_config_win() {
    const css_str = '.popup{ z-index:999999999; position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);padding:20px;background-color:#ffffff;border:1px solid #3498db;border-radius:5px;box-shadow:0 0 10px rgba(0,0,0,0.3);width:200px;max-height:80vh;overflow-y:auto;}.btn{cursor:pointer;background-color:#3498db;color:#ffffff;border:none;padding:5px 10px;margin:0 auto;border-radius:5px;display:block;margin-top:10px;}.recommend-title{user-select: none;font-weight:bold;font-size: large;background-color:#3498db;color:#ffffff;border:none;padding:5px;padding-left:10px;border-radius:5px;width:180px;text-align:start;}.select-group{cursor:pointer;padding:5px;list-style-type:none;margin:0;padding-left:0;user-select: none;}.item-group{list-style-type:none;margin:0;padding-left:0;} .close-btn{position:absolute;top:5px;right:5px;cursor:pointer;border:none;background-color:floralwhite;} label{font-size: large;}';
    const style = document.createElement("style");
    style.textContent = css_str;
    document.body.appendChild(style);
    let win_config;
    const home_watch_config = {
        "recommend_btn": [
            {
                "id": "open_recommend_shorts",
                "title": "btn_recommend_shorts",
                "items": [
                    {
                        "tag": "btn_lable_open",
                        "value": "on",
                    },
                    {
                        "tag": "btn_lable_close",
                        "value": "off",
                    },
                    {
                        "tag": "btn_lable_subscribed",
                        "value": "subscribed",
                        "tips": "recommend_subscribed_lable_tips",
                    }
                ]
            }, {
                "id": "open_recommend_liveroom",
                "title": "btn_recommend_liveroom",
                "items": [
                    {
                        "tag": "btn_lable_open",
                        "value": "on",
                    },
                    {
                        "tag": "btn_lable_close",
                        "value": "off",
                    },
                    {
                        "tag": "btn_lable_subscribed",
                        "value": "subscribed",
                        "tips": "recommend_subscribed_lable_tips",
                    }
                ]
            }
            ,
            {
                "id": "open_recommend_movie",
                "title": "btn_recommend_movie",
                "items": [
                    {
                        "tag": "btn_lable_open",
                        "value": "on",
                    },
                    {
                        "tag": "btn_lable_close",
                        "value": "off",
                    },
                ]
            },
            {
                "id": "open_recommend_popular",
                "title": "btn_recommend_popular",
                "items": [
                    {
                        "tag": "btn_lable_open",
                        "value": "on",
                    },
                    {
                        "tag": "btn_lable_close",
                        "value": "off",
                    },
                ]
            },
            {
                "id": "open_recommend_playables",
                "title": "btn_recommend_game",
                "items": [
                    {
                        "tag": "btn_lable_open",
                        "value": "on",
                    },
                    {
                        "tag": "btn_lable_close",
                        "value": "off",
                    },
                ]
            }

        ]
    };
    const shorts_config = {
        "recommend_btn": [
            {
                "id": "add_shorts_upload_date",
                "title": "title_add_shorts_upload_date",
                "items": [
                    {
                        "tag": "btn_lable_open",
                        "value": "on",
                    },
                    {
                        "tag": "btn_lable_close",
                        "value": "off",
                    },
                ]
            },
            {
                "id": "shorts_change_author_name",
                "title": "title_shorts_change_author_name",
                "items": [
                    {
                        "tag": "btn_lable_open",
                        "value": "on",
                    },
                    {
                        "tag": "btn_lable_close",
                        "value": "off",
                    },
                ]
            },
        ]
    };
    ['mobile_yt_home', 'mobile_yt_watch'].includes(page_type)  && home_watch_config.recommend_btn.push(...shorts_config.recommend_btn);
    ['yt_home', 'mobile_yt_home', 'yt_watch', 'mobile_yt_watch'].includes(page_type) && (win_config = home_watch_config);
    ['yt_shorts'].includes(page_type) && (win_config = shorts_config);
    if (!win_config) return;
    let popup_node = document.getElementById('xxx_popup');
    if (popup_node) {
        popup_node.remove();
    }
    const popup = document.createElement('div');
    popup.id = 'xxx_popup';
    popup.className = 'popup';
    const close_btn = document.createElement('button');
    close_btn.className = 'close-btn';
    close_btn.innerHTML = 'x';
    close_btn.addEventListener('click', remove_popup_hander);
    popup.append(close_btn);
    const item_groups = [];
    const item_group = document.createElement('ul');
    item_group.className = 'item-group';
    win_config.recommend_btn.forEach(recommend_item_info => {
        const recommend_id = recommend_item_info.id;
        const recommend_title = flag_info[recommend_item_info.title];
        const select_item_infos = recommend_item_info.items;
        const select_items = [];
        const item = document.createElement('li');
        const select_group = document.createElement('ul');
        select_group.className = 'select-group';
        select_group.id = recommend_id;
        select_item_infos.forEach(select_item_info => {
            const tag = flag_info[select_item_info.tag];
            const value = select_item_info.value;
            const tips = flag_info[select_item_info.tips];
            const select_item = document.createElement('li');
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = recommend_id + '_option';
            input.id = recommend_id + '_' + value;
            input.value = value;
            if (user_data[recommend_id] === value) {
                input.checked = true;
            }
            input.addEventListener('click', () => {
                handle_recommend_radio(input);
            });
            const label = document.createElement('label');
            label.htmlFor = input.id;
            label.textContent = tag;
            tips && (label.title = tips);
            select_item.append(input, label);
            select_items.push(select_item);
        });
        const recommend_title_div = document.createElement('div');
        recommend_title_div.className = 'recommend-title';
        recommend_title_div.textContent = recommend_title;
        select_group.append(...select_items);
        item.append(recommend_title_div, select_group);
        item_groups.push(item);
    });
    item_group.append(...item_groups);
    popup.append(item_group);
    document.body.append(popup);
    function remove_popup_hander(event) {
        if (!popup.contains(event.target) || event.target === close_btn) {
            popup.remove();
            document.removeEventListener('click', remove_popup_hander);
        }
    }
    document.removeEventListener('click', remove_popup_hander);
    document.addEventListener('click', remove_popup_hander);
}

function handle_recommend_radio(input_obj) {
    user_data[input_obj.parentNode.parentNode.id] = input_obj.value;
    user_data_api.set();
    config_init(user_data.language);
}

function display_update_win() {
    function btn_click() {
        btn = this;
        if (btn.id === 'go_btn') {
            location.href = script_url;
        }
        container.remove();
    }
    const css_str = "#update_tips_win { z-index:999999999; display: flex; position: fixed; bottom: 20px; right: 20px; padding: 10px 20px; background-color: #fff; border: 1px solid #ccc; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); border-radius: 10px; } .btn { margin: 0 10px; display: inline-block; padding: 5px 10px; background-color: #3498db; color: #fff; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease; } .btn:hover { background-color: #2980b9; }";
    const style = document.createElement("style");
    style.textContent = css_str;
    document.body.appendChild(style);
    const container = document.createElement("div");
    container.id = "update_tips_win";
    const span = document.createElement("span");
    span.textContent = GM_info.script.name + '有更新了！！';
    container.appendChild(span);
    const go_btn = document.createElement("button");
    go_btn.textContent = 'GO';
    go_btn.id = 'go_btn';
    go_btn.className = 'btn';
    go_btn.onclick = btn_click;
    container.appendChild(go_btn);
    const no_btn = document.createElement("button");
    no_btn.textContent = 'NO';
    no_btn.className = 'btn';
    no_btn.id = 'no_btn';
    no_btn.onclick = btn_click;
    container.appendChild(no_btn);
    document.body.appendChild(container);
}

function checke_update() {
    let last_check_time = GM_getValue('last_check_time', 0);
    if ((Date.now() - last_check_time) < 1000 * 60 * 60 * 24) return;
    GM_xmlhttpRequest({
        method: 'GET',
        url: script_url,
        onload: function (response) {
            const onlineScript = response.responseText;
            // 从线上脚本中提取版本号和元数据信息
            const onlineMeta = onlineScript.match(/@version\s+([^\s]+)/i);
            const onlineVersion = onlineMeta ? onlineMeta[1] : '';
            if (onlineVersion > GM_info.script.version) {
                display_update_win();
            }
        }
    });
    GM_setValue('last_check_time', Date.now());
}

function obj_process_filter(path_info, json_obj) {
    if (!/yt_(watch|home)$/.test(page_type)) return false;
    if (!user_data.login || user_data.channel_infos.ids.length === 0) return false;

    if (user_data.open_recommend_shorts === 'subscribed' && path_info.condition_value === 'Shorts') {
        let shorts_relative_express = ["richShelfRenderer.title.runs[0].text", 'reelShelfRenderer.title.runs[0].text'];
        if (shorts_relative_express.includes(path_info.relative_path)) {
            let video_list_path;
            if (path_info.relative_path === "reelShelfRenderer.title.runs[0].text") {
                video_list_path = path_info.path.split('["title"]')[0] + '["items"]';
            }
            if (path_info.relative_path === "richShelfRenderer.title.runs[0].text") {
                video_list_path = path_info.path.split('["title"]')[0] + '["contents"]';
            }
            const video_list = data_process.string_to_value(json_obj, video_list_path) || [];
            shorts_fun.node_parse(video_list);
        }
    }

    if (user_data.open_recommend_liveroom === 'subscribed' && [flag_info.upcoming, flag_info.live].includes(path_info.condition_value)) {
        let live_express = ['text.accessibility.accessibilityData.label........=- =' + flag_info.live,
        'metadataBadgeRenderer.label......=- =' + flag_info.live,
        'metadataBadgeRenderer.label.....=- =' + flag_info.live
        ];
        let upcoming_express = ['thumbnailOverlayTimeStatusRenderer.text.runs[0].text.........=- =' + flag_info.upcoming, 'thumbnailOverlayTimeStatusRenderer.text.simpleText.......=- =' + flag_info.upcoming];
        if (live_express.includes(path_info.express)) {
            try {
                let match = JSON.stringify(data_process.string_to_value(json_obj, path_info.deal_path)).match(/"browseId"\:"(.*?)"/);
                let id;
                if (match && match.length > 1) id = match[1];
                if (!id) {
                    log('id获取失败\n' + JSON.stringify(path_info), -1);
                }
                if (!user_data.channel_infos.ids.includes(id)) {
                    log('过滤' + id + '的直播', 0);
                } else {
                    let index = user_data.channel_infos.ids.indexOf(id);
                    let name = user_data.channel_infos.names[index];
                    log('不过滤' + name + '的直播', 0);
                    return true;
                }
            } catch (error) {
                log(error, -1);
            }
        }
        if (upcoming_express.includes(path_info.express)) {
            try {
                let match = JSON.stringify(data_process.string_to_value(json_obj, path_info.deal_path)).match(/"browseId"\:"(.*?)"/);
                let id;
                if (match && match.length > 1) id = match[1];
                if (!id) {
                    log('id获取失败\n' + JSON.stringify(path_info), -1);
                }
                if (!user_data.channel_infos.ids.includes(id)) {
                    log('过滤' + id + '等待发布的直播', 0);
                } else {
                    let index = user_data.channel_infos.ids.indexOf(id);
                    let name = user_data.channel_infos.names[index];
                    log('不过滤' + name + '等待发布的直播', 0);
                    return true;
                }
            } catch (error) {
                log(error, -1);
            }
        }

    }
    return false;
}

function get_shorts_fun() {
    class ShortsFun {
        constructor(){

            this.parsing = false;
            this.shorts_list = [];
            // this.author_info_list = [];
            // this.author_info_dict = {};
        }
        node_parse(video_list){


            !user_data.shorts_list && (user_data.shorts_list = []);
            let video_id, title, views_lable, thumbnail_url;
            let count = 0;
            for (let video_info of video_list) {
                count++;
                if (page_type === "yt_home") {
                    video_id = video_info.richItemRenderer.content.reelItemRenderer.videoId;
                    title = video_info.richItemRenderer.content.reelItemRenderer.headline.simpleText;
                    views_lable = video_info.richItemRenderer.content.reelItemRenderer.viewCountText.simpleText;
                    thumbnail_url = video_info.richItemRenderer.content.reelItemRenderer.thumbnail.thumbnails[0].url;
                }
                else if (page_type === "yt_watch") {
                    video_id = video_info.reelItemRenderer.videoId;
                    title = video_info.reelItemRenderer.headline.simpleText;
                    views_lable = video_info.reelItemRenderer.viewCountText.simpleText;
                    thumbnail_url = video_info.reelItemRenderer.thumbnail.thumbnails[0].url;
                }
                else if (page_type === "mobile_yt_home") {
                    video_id = video_info.shortsLockupViewModel.entityId.replace('shorts-shelf-item-', '');
                    title = video_info.shortsLockupViewModel.overlayMetadata.primaryText.content;
                    views_lable = video_info.shortsLockupViewModel.overlayMetadata.secondaryText.content;
                    thumbnail_url = video_info.shortsLockupViewModel.thumbnail.sources[0].url;
                }
                this.shorts_list.push({
                    id: video_id,
                    title: title,
                    views_lable: views_lable,
                    thumbnail_url: thumbnail_url
                });
                if (!this.parsing) {
                    this.parsing = true;
                    setTimeout(() => {
                        this.parse_shorts_list();
                    }, shorts_parse_delay);
                }
            }
        }
        get_shorts_section(){
            if (!user_data.shorts_list || !user_data.shorts_list.length) return;
            let root, item_path;
            const items = [];
            if (page_type == 'yt_home') {
                root = {
                    "richSectionRenderer": {
                        "content": {
                            "richShelfRenderer": {
                                "title": {
                                    "runs": [
                                        {
                                            "text": "Shorts"
                                        }
                                    ]
                                },
                                "contents": [],
                                "trackingParams": "CNMEEN-DAyITCOGA_NHuz4UDFWdqTAgdfF4E-Q==",
                                "menu": {
                                    "menuRenderer": {
                                        "trackingParams": "CNMEEN-DAyITCOGA_NHuz4UDFWdqTAgdfF4E-Q==",
                                        "topLevelButtons": [
                                            {
                                                "buttonRenderer": {
                                                    "style": "STYLE_OPACITY",
                                                    "size": "SIZE_DEFAULT",
                                                    "isDisabled": false,
                                                    "serviceEndpoint": {
                                                        "clickTrackingParams": "CNYEEKqJCRgMIhMI4YD80e7PhQMVZ2pMCB18XgT5",
                                                        "commandMetadata": {
                                                            "webCommandMetadata": {
                                                                "sendPost": true,
                                                                "apiUrl": "/youtubei/v1/feedback"
                                                            }
                                                        },
                                                        "feedbackEndpoint": {
                                                            "feedbackToken": "AB9zfpIcTXNyA3lbF_28icb4umRJ5AveSSTqmF7T9gE8k-Sw7HrOTLE5wzA2TScqfTByCI-cR9nPuVMSWAgbNuuaruVBYx2-2dGAzujQTL8KGMOyCFM_wmGhkLTSdUBQzsFQRHEibpg_",
                                                            "uiActions": {
                                                                "hideEnclosingContainer": true
                                                            },
                                                            "actions": [
                                                                {
                                                                    "clickTrackingParams": "CNYEEKqJCRgMIhMI4YD80e7PhQMVZ2pMCB18XgT5",
                                                                    "replaceEnclosingAction": {
                                                                        "item": {
                                                                            "notificationMultiActionRenderer": {
                                                                                "responseText": {
                                                                                    "runs": [
                                                                                        {
                                                                                            "text": "Shelf will be hidden for "
                                                                                        },
                                                                                        {
                                                                                            "text": "30"
                                                                                        },
                                                                                        {
                                                                                            "text": " days"
                                                                                        }
                                                                                    ]
                                                                                },
                                                                                "buttons": [
                                                                                    {
                                                                                        "buttonRenderer": {
                                                                                            "style": "STYLE_BLUE_TEXT",
                                                                                            "text": {
                                                                                                "simpleText": "Undo"
                                                                                            },
                                                                                            "serviceEndpoint": {
                                                                                                "clickTrackingParams": "CNgEEPBbGAAiEwjhgPzR7s-FAxVnakwIHXxeBPk=",
                                                                                                "commandMetadata": {
                                                                                                    "webCommandMetadata": {
                                                                                                        "sendPost": true,
                                                                                                        "apiUrl": "/youtubei/v1/feedback"
                                                                                                    }
                                                                                                },
                                                                                                "undoFeedbackEndpoint": {
                                                                                                    "undoToken": "AB9zfpLpAillN1hH9cyfSbyPRWwAhTOJo6mUTu-ony4HASc0KgCEy0ifaIrDUdJJEk4OXiPC43EMPZBEK8WGiIqeci4r97TGpabAUk84dEh7tHzF7-rsziFBGZjY92Jyk3YujrF2_wxC",
                                                                                                    "actions": [
                                                                                                        {
                                                                                                            "clickTrackingParams": "CNgEEPBbGAAiEwjhgPzR7s-FAxVnakwIHXxeBPk=",
                                                                                                            "undoFeedbackAction": {
                                                                                                                "hack": true
                                                                                                            }
                                                                                                        }
                                                                                                    ]
                                                                                                }
                                                                                            },
                                                                                            "trackingParams": "CNgEEPBbGAAiEwjhgPzR7s-FAxVnakwIHXxeBPk="
                                                                                        }
                                                                                    }
                                                                                ],
                                                                                "trackingParams": "CNcEEKW8ASITCOGA_NHuz4UDFWdqTAgdfF4E-Q=="
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    "icon": {
                                                        "iconType": "DISMISSAL"
                                                    },
                                                    "tooltip": "Not interested",
                                                    "trackingParams": "CNYEEKqJCRgMIhMI4YD80e7PhQMVZ2pMCB18XgT5",
                                                    "accessibilityData": {
                                                        "accessibilityData": {
                                                            "label": "Not interested"
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                },
                                "showMoreButton": {
                                    "buttonRenderer": {
                                        "style": "STYLE_OPACITY",
                                        "size": "SIZE_DEFAULT",
                                        "text": {
                                            "runs": [
                                                {
                                                    "text": "Show more"
                                                }
                                            ]
                                        },
                                        "icon": {
                                            "iconType": "EXPAND"
                                        },
                                        "accessibility": {
                                            "label": "Show more"
                                        },
                                        "trackingParams": "CNUEEJnjCyITCOGA_NHuz4UDFWdqTAgdfF4E-Q=="
                                    }
                                },
                                "isExpanded": false,
                                "icon": {
                                    "iconType": "YOUTUBE_SHORTS_BRAND_24"
                                },
                                "isTopDividerHidden": false,
                                "isBottomDividerHidden": false,
                                "showLessButton": {
                                    "buttonRenderer": {
                                        "style": "STYLE_OPACITY",
                                        "size": "SIZE_DEFAULT",
                                        "text": {
                                            "runs": [
                                                {
                                                    "text": "Show less"
                                                }
                                            ]
                                        },
                                        "icon": {
                                            "iconType": "COLLAPSE"
                                        },
                                        "accessibility": {
                                            "label": "Show less"
                                        },
                                        "trackingParams": "CNQEEPBbIhMI4YD80e7PhQMVZ2pMCB18XgT5"
                                    }
                                }
                            }
                        },
                        "trackingParams": "CNIEEOOXBRgEIhMI4YD80e7PhQMVZ2pMCB18XgT5",
                        "fullBleed": false
                    }
                };
                item_path = 'root.richSectionRenderer.content.richShelfRenderer.contents';
            }
            else if (page_type == 'yt_watch') {
                root = {
                    "reelShelfRenderer": {
                        "title": {
                            "runs": [
                                {
                                    "text": "Shorts"
                                }
                            ]
                        },
                        "items": [],
                        "trackingParams": "CM4CEN-DAxgEIhMInKOvhY3QhQMVGcCXCB04HQR6",
                        "icon": {
                            "iconType": "YOUTUBE_SHORTS_BRAND_24"
                        }
                    }
                };
                item_path = 'root.reelShelfRenderer.items';
            }
            else if (page_type == 'mobile_yt_home') {
                root = {
                    "richSectionRenderer": {
                        "content": {
                            "reelShelfRenderer": {
                                "title": {
                                    "runs": [
                                        {
                                            "text": "Shorts"
                                        }
                                    ]
                                },
                                "button": {
                                    "menuRenderer": {
                                        "trackingParams": "CHYQ34MDIhMIqeqAyo7QhQMVz3lMCB2mCA0J",
                                        "topLevelButtons": [
                                            {
                                                "buttonRenderer": {
                                                    "style": "STYLE_DEFAULT",
                                                    "size": "SIZE_DEFAULT",
                                                    "isDisabled": false,
                                                    "serviceEndpoint": {
                                                        "clickTrackingParams": "CLMBEKqJCRgPIhMIqeqAyo7QhQMVz3lMCB2mCA0J",
                                                        "commandMetadata": {
                                                            "webCommandMetadata": {
                                                                "sendPost": true,
                                                                "apiUrl": "/youtubei/v1/feedback"
                                                            }
                                                        },
                                                        "feedbackEndpoint": {
                                                            "feedbackToken": "AB9zfpJSnrbvskPWkpziyGduKV-4gTxm30-eNNYDobzecpLq84dL6HwCxdX_zbvm_OmxSKdlsngHEE1CF7JKYGiyDVYV_Q7p9ihGCzOYcnqKcAJfNnSp-U-njcnKLgCWu_USr-2prW3x",
                                                            "uiActions": {
                                                                "hideEnclosingContainer": true
                                                            },
                                                            "actions": [
                                                                {
                                                                    "clickTrackingParams": "CLMBEKqJCRgPIhMIqeqAyo7QhQMVz3lMCB2mCA0J",
                                                                    "replaceEnclosingAction": {
                                                                        "item": {
                                                                            "notificationMultiActionRenderer": {
                                                                                "responseText": {
                                                                                    "runs": [
                                                                                        {
                                                                                            "text": "Shelf will be hidden for "
                                                                                        },
                                                                                        {
                                                                                            "text": "30"
                                                                                        },
                                                                                        {
                                                                                            "text": " days"
                                                                                        }
                                                                                    ]
                                                                                },
                                                                                "buttons": [
                                                                                    {
                                                                                        "buttonRenderer": {
                                                                                            "style": "STYLE_MONO_TONAL",
                                                                                            "text": {
                                                                                                "runs": [
                                                                                                    {
                                                                                                        "text": "Undo"
                                                                                                    }
                                                                                                ]
                                                                                            },
                                                                                            "serviceEndpoint": {
                                                                                                "clickTrackingParams": "CLUBEPBbGAAiEwip6oDKjtCFAxXPeUwIHaYIDQk=",
                                                                                                "commandMetadata": {
                                                                                                    "webCommandMetadata": {
                                                                                                        "sendPost": true,
                                                                                                        "apiUrl": "/youtubei/v1/feedback"
                                                                                                    }
                                                                                                },
                                                                                                "undoFeedbackEndpoint": {
                                                                                                    "undoToken": "AB9zfpK-nY3vxgYDkvJSkuFdbeBltD0r4XdLzoFqxz6OPnmJrroOAxKfUuDny8kPjB9yyWzwEerOZqe90BakCPEJXycRSrH8sZAdnlWpEs0n0lx6qOFERE6o5jkK3mgbcVCM-Al38oGV",
                                                                                                    "actions": [
                                                                                                        {
                                                                                                            "clickTrackingParams": "CLUBEPBbGAAiEwip6oDKjtCFAxXPeUwIHaYIDQk=",
                                                                                                            "undoFeedbackAction": {
                                                                                                                "hack": true
                                                                                                            }
                                                                                                        }
                                                                                                    ]
                                                                                                }
                                                                                            },
                                                                                            "trackingParams": "CLUBEPBbGAAiEwip6oDKjtCFAxXPeUwIHaYIDQk="
                                                                                        }
                                                                                    }
                                                                                ],
                                                                                "trackingParams": "CLQBEKW8ASITCKnqgMqO0IUDFc95TAgdpggNCQ=="
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    "icon": {
                                                        "iconType": "DISMISSAL"
                                                    },
                                                    "tooltip": "Not interested",
                                                    "trackingParams": "CLMBEKqJCRgPIhMIqeqAyo7QhQMVz3lMCB2mCA0J",
                                                    "accessibilityData": {
                                                        "accessibilityData": {
                                                            "label": "Not interested"
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                },
                                "items": [

                                ],
                                "trackingParams": "CHYQ34MDIhMIqeqAyo7QhQMVz3lMCB2mCA0J",
                                "icon": {
                                    "iconType": "YOUTUBE_SHORTS_BRAND_24"
                                }
                            }
                        },
                        "trackingParams": "CHUQ45cFGAEiEwip6oDKjtCFAxXPeUwIHaYIDQk=",
                        "fullBleed": false
                    }
                };
                item_path = 'root.richSectionRenderer.content.reelShelfRenderer.items';
            }
            let shorts;
            while (shorts = user_data.shorts_list.pop()) {
                let id = shorts['id'];
                let title = shorts['title'];
                let views_lable = shorts['views_lable'];
                let from = shorts['from'];
                let thumbnail_url = shorts['thumbnail_url'];
                let tmp_item;
                if (['yt_home', 'yt_watch'].includes(page_type)) {
                    tmp_item = {
                        "reelItemRenderer": {
                            "videoId": id,
                            "headline": {
                                "simpleText": title
                            },
                            "thumbnail": {
                                "thumbnails": [
                                    {
                                        "url": thumbnail_url,
                                        "width": 405,
                                        "height": 720
                                    }
                                ],
                                "isOriginalAspectRatio": true
                            },
                            "viewCountText": {
                                "accessibility": {
                                    "accessibilityData": {
                                        "label": views_lable
                                    }
                                },
                                "simpleText": views_lable
                            },
                            "navigationEndpoint": {
                                "clickTrackingParams": "COsCEIf2BBgAIhMInKOvhY3QhQMVGcCXCB04HQR6mgEFCCUQ-B0=",
                                "commandMetadata": {
                                    "webCommandMetadata": {
                                        "url": "/shorts/" + id,
                                        "webPageType": "WEB_PAGE_TYPE_SHORTS",
                                        "rootVe": 37414
                                    }
                                },
                                "reelWatchEndpoint": {
                                    "videoId": id,
                                    "playerParams": "8AEBoAMCyAMluAQGogYVAdXZ-jvMfGWnXiNDPh0oiMSTJMUn",
                                    "thumbnail": {
                                        "thumbnails": [
                                            {
                                                "url": "https://i.ytimg.com/vi/" + id + "/frame0.jpg",
                                                "width": 1080,
                                                "height": 1920
                                            }
                                        ],
                                        "isOriginalAspectRatio": true
                                    },
                                    "overlay": {
                                        "reelPlayerOverlayRenderer": {
                                            "style": "REEL_PLAYER_OVERLAY_STYLE_SHORTS",
                                            "trackingParams": "CO4CELC1BCITCJyjr4WN0IUDFRnAlwgdOB0Eeg==",
                                            "reelPlayerNavigationModel": "REEL_PLAYER_NAVIGATION_MODEL_UNSPECIFIED"
                                        }
                                    },
                                    "params": "CAYwAg%3D%3D",
                                    "sequenceProvider": "REEL_WATCH_SEQUENCE_PROVIDER_RPC",
                                    "sequenceParams": "CgtLRmRCbnpnSjJZWSoCGAZQGWgA",
                                    "loggingContext": {
                                        "vssLoggingContext": {
                                            "serializedContextData": "CgIIDA%3D%3D"
                                        },
                                        "qoeLoggingContext": {
                                            "serializedContextData": "CgIIDA%3D%3D"
                                        }
                                    },
                                    "ustreamerConfig": "CAwSHDFIakVXUytucVRyTENNWlgzMXdDZmYwamZQQ0U="
                                }
                            },
                            "menu": {
                                "menuRenderer": {
                                    "items": [
                                        {
                                            "menuServiceItemRenderer": {
                                                "text": {
                                                    "runs": [
                                                        {
                                                            "text": "Report"
                                                        }
                                                    ]
                                                },
                                                "icon": {
                                                    "iconType": "FLAG"
                                                },
                                                "serviceEndpoint": {
                                                    "clickTrackingParams": "COsCEIf2BBgAIhMInKOvhY3QhQMVGcCXCB04HQR6",
                                                    "commandMetadata": {
                                                        "webCommandMetadata": {
                                                            "sendPost": true,
                                                            "apiUrl": "/youtubei/v1/flag/get_form"
                                                        }
                                                    },
                                                    "getReportFormEndpoint": {
                                                        "params": "EgtLRmRCbnpnSjJZWUABWABwAXgB2AEA6AEA"
                                                    }
                                                },
                                                "trackingParams": "COsCEIf2BBgAIhMInKOvhY3QhQMVGcCXCB04HQR6"
                                            }
                                        },
                                        {
                                            "menuServiceItemRenderer": {
                                                "text": {
                                                    "runs": [
                                                        {
                                                            "text": "Not interested"
                                                        }
                                                    ]
                                                },
                                                "icon": {
                                                    "iconType": "NOT_INTERESTED"
                                                },
                                                "serviceEndpoint": {
                                                    "clickTrackingParams": "COsCEIf2BBgAIhMInKOvhY3QhQMVGcCXCB04HQR6",
                                                    "commandMetadata": {
                                                        "webCommandMetadata": {
                                                            "sendPost": true,
                                                            "apiUrl": "/youtubei/v1/feedback"
                                                        }
                                                    },
                                                    "feedbackEndpoint": {
                                                        "feedbackToken": "AB9zfpIBjY8nLioWtHjvUvMvrLXfhPMooShdpv91xgNNrZuxibAl6QyPeYMe7faEHcrSUm-TIqvLe2ThmYQpNRUy9rPbV1k3jjrvqqc5cOLBvnV8oN0Kbrq3-K9IjJXYitJPyOzJU0uy",
                                                        "actions": [
                                                            {
                                                                "clickTrackingParams": "COsCEIf2BBgAIhMInKOvhY3QhQMVGcCXCB04HQR6",
                                                                "replaceEnclosingAction": {
                                                                    "item": {
                                                                        "notificationMultiActionRenderer": {
                                                                            "responseText": {
                                                                                "runs": [
                                                                                    {
                                                                                        "text": "Video removed"
                                                                                    }
                                                                                ]
                                                                            },
                                                                            "buttons": [
                                                                                {
                                                                                    "buttonRenderer": {
                                                                                        "style": "STYLE_BLUE_TEXT",
                                                                                        "text": {
                                                                                            "runs": [
                                                                                                {
                                                                                                    "text": "Undo"
                                                                                                }
                                                                                            ]
                                                                                        },
                                                                                        "serviceEndpoint": {
                                                                                            "clickTrackingParams": "CO0CEPBbGAAiEwico6-FjdCFAxUZwJcIHTgdBHo=",
                                                                                            "commandMetadata": {
                                                                                                "webCommandMetadata": {
                                                                                                    "sendPost": true,
                                                                                                    "apiUrl": "/youtubei/v1/feedback"
                                                                                                }
                                                                                            },
                                                                                            "undoFeedbackEndpoint": {
                                                                                                "undoToken": "AB9zfpK74nsMbZ4OfNgKTgA9g0w3Q8o72jdm384D3y82OAuy2KgvTUOAn-iII915ZC_7aqAxTK-XNir21X_T3WQEeAzdy4hCZ6o0f12hfdHW8xI1js1WB_CEn3EW27P9_1vu5dw2kDeW",
                                                                                                "actions": [
                                                                                                    {
                                                                                                        "clickTrackingParams": "CO0CEPBbGAAiEwico6-FjdCFAxUZwJcIHTgdBHo=",
                                                                                                        "undoFeedbackAction": {
                                                                                                            "hack": true
                                                                                                        }
                                                                                                    }
                                                                                                ]
                                                                                            }
                                                                                        },
                                                                                        "trackingParams": "CO0CEPBbGAAiEwico6-FjdCFAxUZwJcIHTgdBHo="
                                                                                    }
                                                                                }
                                                                            ],
                                                                            "trackingParams": "COwCEKW8ASITCJyjr4WN0IUDFRnAlwgdOB0Eeg=="
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        ]
                                                    }
                                                },
                                                "trackingParams": "COsCEIf2BBgAIhMInKOvhY3QhQMVGcCXCB04HQR6",
                                                "accessibility": {
                                                    "accessibilityData": {
                                                        "label": "Not interested"
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            "menuNavigationItemRenderer": {
                                                "text": {
                                                    "runs": [
                                                        {
                                                            "text": "Send feedback"
                                                        }
                                                    ]
                                                },
                                                "icon": {
                                                    "iconType": "FEEDBACK"
                                                },
                                                "navigationEndpoint": {
                                                    "clickTrackingParams": "COsCEIf2BBgAIhMInKOvhY3QhQMVGcCXCB04HQR6",
                                                    "commandMetadata": {
                                                        "webCommandMetadata": {
                                                            "ignoreNavigation": true
                                                        }
                                                    },
                                                    "userFeedbackEndpoint": {
                                                        "additionalDatas": [
                                                            {
                                                                "userFeedbackEndpointProductSpecificValueData": {
                                                                    "key": "video_id",
                                                                    "value": id
                                                                }
                                                            },
                                                            {
                                                                "userFeedbackEndpointProductSpecificValueData": {
                                                                    "key": "lockup",
                                                                    "value": "shelf"
                                                                }
                                                            }
                                                        ]
                                                    }
                                                },
                                                "trackingParams": "COsCEIf2BBgAIhMInKOvhY3QhQMVGcCXCB04HQR6",
                                                "accessibility": {
                                                    "accessibilityData": {
                                                        "label": "Send feedback"
                                                    }
                                                }
                                            }
                                        }
                                    ],
                                    "trackingParams": "COsCEIf2BBgAIhMInKOvhY3QhQMVGcCXCB04HQR6",
                                    "accessibility": {
                                        "accessibilityData": {
                                            "label": "More actions"
                                        }
                                    }
                                }
                            },
                            "trackingParams": "COsCEIf2BBgAIhMInKOvhY3QhQMVGcCXCB04HQR6QIazp8Dzs9CrKA==",
                            "accessibility": {
                                "accessibilityData": {
                                    "label": title + " - play Short"
                                }
                            },
                            "style": "REEL_ITEM_STYLE_AVATAR_CIRCLE",
                            "dismissalInfo": {
                                "feedbackToken": "AB9zfpLIJd1aRU9JzdOjpgeJBW2QvHH79sx6dM6ZCDEzyc5qrISZBSpNRe5lerckNHwQ10BOwEQhlquLlHP-nkuA4VSSCXX0XgMJHBnKWBxlIXkQ1pLIUjd6cQKhrCUioDfix7xn5Ecj"
                            },
                            "videoType": "REEL_VIDEO_TYPE_VIDEO",
                            "loggingDirectives": {
                                "trackingParams": "COsCEIf2BBgAIhMInKOvhY3QhQMVGcCXCB04HQR6",
                                "visibility": {
                                    "types": "12"
                                },
                                "enableDisplayloggerExperiment": true
                            }
                        }
                    };
                }
                if (page_type == "yt_home") {
                    tmp_item = {
                        "richItemRenderer": {
                            "content": tmp_item,
                            "trackingParams": "CJsFEJmNBRgAIhMI4YD80e7PhQMVZ2pMCB18XgT5"
                        }
                    };
                }
                else if (page_type == "mobile_yt_home") {
                    tmp_item = {
                        "shortsLockupViewModel": {
                            "entityId": "shorts-shelf-item-" + id,
                            "accessibilityText": title + ", " + views_lable + " - play Short",
                            "thumbnail": {
                                "sources": [
                                    {
                                        "url": thumbnail_url,
                                        "width": 405,
                                        "height": 720
                                    }
                                ]
                            },
                            "onTap": {
                                "innertubeCommand": {
                                    "clickTrackingParams": "CK8BEIf2BBgAIhMIqeqAyo7QhQMVz3lMCB2mCA0JWg9GRXdoYXRfdG9fd2F0Y2iaAQUIJBCOHg==",
                                    "commandMetadata": {
                                        "webCommandMetadata": {
                                            "url": "/shorts/" + id,
                                            "webPageType": "WEB_PAGE_TYPE_SHORTS",
                                            "rootVe": 37414
                                        }
                                    },
                                    "reelWatchEndpoint": {
                                        "videoId": id,
                                        "playerParams": "8AEBoAMByAMkuAQFogYVAdXZ-jveUoR0s0_R7sLGUd85_xAk",
                                        "thumbnail": {
                                            "thumbnails": [
                                                {
                                                    "url": "https://i.ytimg.com/vi/" + id + "/frame0.jpg",
                                                    "width": 1080,
                                                    "height": 1920
                                                }
                                            ],
                                            "isOriginalAspectRatio": true
                                        },
                                        "overlay": {
                                            "reelPlayerOverlayRenderer": {
                                                "style": "REEL_PLAYER_OVERLAY_STYLE_SHORTS",
                                                "trackingParams": "CLIBELC1BCITCKnqgMqO0IUDFc95TAgdpggNCQ==",
                                                "reelPlayerNavigationModel": "REEL_PLAYER_NAVIGATION_MODEL_UNSPECIFIED"
                                            }
                                        },
                                        "params": "CAUwAg%3D%3D",
                                        "sequenceProvider": "REEL_WATCH_SEQUENCE_PROVIDER_RPC",
                                        "sequenceParams": "CgtwblVoZV9PUTE2byoCGAVQGWgA",
                                        "loggingContext": {
                                            "vssLoggingContext": {
                                                "serializedContextData": "CgIIDA%3D%3D"
                                            },
                                            "qoeLoggingContext": {
                                                "serializedContextData": "CgIIDA%3D%3D"
                                            }
                                        },
                                        "ustreamerConfig": "CAwSHDFIakVXUytucVRyTENNWlgzMXdDZmYwamZQQ0U="
                                    }
                                }
                            },
                            "inlinePlayerData": {
                                "onVisible": {
                                    "innertubeCommand": {
                                        "clickTrackingParams": "CK8BEIf2BBgAIhMIqeqAyo7QhQMVz3lMCB2mCA0JMgZnLWhpZ2haD0ZFd2hhdF90b193YXRjaJoBBQgkEI4e",
                                        "commandMetadata": {
                                            "webCommandMetadata": {
                                                "url": "/watch?v=" + id + "&pp=YAHIAQG6AwIYAugFAQ%3D%3D",
                                                "webPageType": "WEB_PAGE_TYPE_WATCH",
                                                "rootVe": 3832
                                            }
                                        },
                                        "watchEndpoint": {
                                            "videoId": id,
                                            "playerParams": "YAHIAQG6AwIYAugFAQ%3D%3D"
                                        }
                                    }
                                }
                            },
                            "menuOnTap": {
                                "innertubeCommand": {
                                    "clickTrackingParams": "CK8BEIf2BBgAIhMIqeqAyo7QhQMVz3lMCB2mCA0J",
                                    "showSheetCommand": {
                                        "panelLoadingStrategy": {
                                            "inlineContent": {
                                                "sheetViewModel": {
                                                    "content": {
                                                        "listViewModel": {
                                                            "listItems": [
                                                                {
                                                                    "listItemViewModel": {
                                                                        "title": {
                                                                            "content": "Not interested"
                                                                        },
                                                                        "leadingImage": {
                                                                            "sources": [
                                                                                {
                                                                                    "clientResource": {
                                                                                        "imageName": "NOT_INTERESTED"
                                                                                    }
                                                                                }
                                                                            ]
                                                                        },
                                                                        "rendererContext": {
                                                                            "commandContext": {
                                                                                "onTap": {
                                                                                    "innertubeCommand": {
                                                                                        "clickTrackingParams": "CK8BEIf2BBgAIhMIqeqAyo7QhQMVz3lMCB2mCA0J",
                                                                                        "commandMetadata": {
                                                                                            "webCommandMetadata": {
                                                                                                "sendPost": true,
                                                                                                "apiUrl": "/youtubei/v1/feedback"
                                                                                            }
                                                                                        },
                                                                                        "feedbackEndpoint": {
                                                                                            "feedbackToken": "AB9zfpJnMNgSEnsvYAu4UXP6IN5z0VfAt-OZOs8ypsKND9Mv5RhoELjmgb_vxVOvvYoiM2f8q9QFcdGMOEOCSk7LPYMnGshEHKcis4oeot-Z5OsgYpmOP3DbMXgFHUgQhOUAjL-FIj5y",
                                                                                            "actions": [
                                                                                                {
                                                                                                    "clickTrackingParams": "CK8BEIf2BBgAIhMIqeqAyo7QhQMVz3lMCB2mCA0J",
                                                                                                    "replaceEnclosingAction": {
                                                                                                        "item": {
                                                                                                            "notificationMultiActionRenderer": {
                                                                                                                "responseText": {
                                                                                                                    "runs": [
                                                                                                                        {
                                                                                                                            "text": "Video removed"
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                "buttons": [
                                                                                                                    {
                                                                                                                        "buttonRenderer": {
                                                                                                                            "style": "STYLE_BLUE_TEXT",
                                                                                                                            "text": {
                                                                                                                                "runs": [
                                                                                                                                    {
                                                                                                                                        "text": "Undo"
                                                                                                                                    }
                                                                                                                                ]
                                                                                                                            },
                                                                                                                            "serviceEndpoint": {
                                                                                                                                "clickTrackingParams": "CLEBEPBbGAAiEwip6oDKjtCFAxXPeUwIHaYIDQk=",
                                                                                                                                "commandMetadata": {
                                                                                                                                    "webCommandMetadata": {
                                                                                                                                        "sendPost": true,
                                                                                                                                        "apiUrl": "/youtubei/v1/feedback"
                                                                                                                                    }
                                                                                                                                },
                                                                                                                                "undoFeedbackEndpoint": {
                                                                                                                                    "undoToken": "AB9zfpI_UgAQH8eSODf7gCfkDtllqeFC5Qr38N7cNnlz8NmYZ78F2KiuX3KZNcumX2jfVXRzNfd2M0V7vud8UdS2Hz7SshgqVTn2TOJApWBlkIPTbUYWuQkX2CSbVKZw1p3wIHkjQOH7",
                                                                                                                                    "actions": [
                                                                                                                                        {
                                                                                                                                            "clickTrackingParams": "CLEBEPBbGAAiEwip6oDKjtCFAxXPeUwIHaYIDQk=",
                                                                                                                                            "undoFeedbackAction": {
                                                                                                                                                "hack": true
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    ]
                                                                                                                                }
                                                                                                                            },
                                                                                                                            "trackingParams": "CLEBEPBbGAAiEwip6oDKjtCFAxXPeUwIHaYIDQk="
                                                                                                                        }
                                                                                                                    }
                                                                                                                ],
                                                                                                                "trackingParams": "CLABEKW8ASITCKnqgMqO0IUDFc95TAgdpggNCQ=="
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            ]
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    "listItemViewModel": {
                                                                        "title": {
                                                                            "content": "Send feedback"
                                                                        },
                                                                        "leadingImage": {
                                                                            "sources": [
                                                                                {
                                                                                    "clientResource": {
                                                                                        "imageName": "FEEDBACK"
                                                                                    }
                                                                                }
                                                                            ]
                                                                        },
                                                                        "rendererContext": {
                                                                            "commandContext": {
                                                                                "onTap": {
                                                                                    "innertubeCommand": {
                                                                                        "clickTrackingParams": "CK8BEIf2BBgAIhMIqeqAyo7QhQMVz3lMCB2mCA0J",
                                                                                        "commandMetadata": {
                                                                                            "webCommandMetadata": {
                                                                                                "ignoreNavigation": true
                                                                                            }
                                                                                        },
                                                                                        "userFeedbackEndpoint": {
                                                                                            "additionalDatas": [
                                                                                                {
                                                                                                    "userFeedbackEndpointProductSpecificValueData": {
                                                                                                        "key": "video_id",
                                                                                                        "value": id
                                                                                                    }
                                                                                                },
                                                                                                {
                                                                                                    "userFeedbackEndpointProductSpecificValueData": {
                                                                                                        "key": "lockup",
                                                                                                        "value": "shelf"
                                                                                                    }
                                                                                                }
                                                                                            ]
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "indexInCollection": 0,
                            "menuOnTapA11yLabel": "More actions",
                            "overlayMetadata": {
                                "primaryText": {
                                    "content": title,
                                    "styleRuns": [
                                        {
                                            "startIndex": 0,
                                            "fontName": "",
                                            "fontSize": 0,
                                            "fontColor": 4294967295
                                        }
                                    ]
                                },
                                "secondaryText": {
                                    "content": views_lable,
                                    "styleRuns": [
                                        {
                                            "startIndex": 0,
                                            "fontName": "",
                                            "fontSize": 0,
                                            "fontColor": 4294967295
                                        }
                                    ]
                                }
                            },
                            "loggingDirectives": {
                                "trackingParams": "CK8BEIf2BBgAIhMIqeqAyo7QhQMVz3lMCB2mCA0J",
                                "visibility": {
                                    "types": "12"
                                },
                                "enableDisplayloggerExperiment": true
                            }
                        }
                    };
                }
                if (tmp_item) items.push(tmp_item);
            }
            eval(item_path + ' = items');
            user_data_api.set();

            return root;
        }

        get_shorts_info (video_id) {
            return new Promise((resolve, reject) => {
                let basic_url, author_id_reg, author_name_reg, upload_date_reg;
                if (page_type.startsWith('mobile')) {
                    basic_url = 'https://m.youtube.com/watch?&v=';
                    author_id_reg = /"channelId":"(.*)"/;
                    author_name_reg = /"ownerChannelName":"(.*)"/;
                    upload_date_reg = /"uploadDate":"(.*)"/;
                } else {
                    basic_url = 'https://www.youtube.com/shorts/';
                    author_id_reg = /"browseId":"([a-zA-Z0-9\-_]+)","canonicalBaseUrl"/;
                    author_name_reg = /"channel":\{"simpleText":"(.*)"/;
                    upload_date_reg = /"uploadDate":"(.*)"/;
                }
                const url = basic_url + video_id;
                const xhr = new XMLHttpRequest();
                xhr.open('GET', url);
                xhr.setRequestHeader('accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7');
                let author_id = '';
                let author_name = '';
                let upload_date_str = '';
                let upload_date;
                xhr.onload = function () {
                    if (xhr.status === 200 && xhr.readyState === XMLHttpRequest.DONE) {
                        match = xhr.responseText.match(author_id_reg);
                        if (match) author_id = match[1] || '';
                        match = xhr.responseText.match(author_name_reg);
                        if (match) author_name = match[1] || '';
                        const upload_date_math = xhr.responseText.match(upload_date_reg);
                        if (upload_date_math) upload_date_str = upload_date_math[1] || '';
                        upload_date_str && !isNaN(new Date(upload_date_str)) && (upload_date = new Date(upload_date_str));
                        resolve({
                            id: video_id,
                            author_id: author_id,
                            author_name: author_name,
                            upload_date: upload_date
                        });
                    } else {
                        reject(xhr.responseText);
                    }
                };
                xhr.onerror = function () {
                    reject(new Error('XHR request failed'));
                };
                xhr.send();
            });
        }

        parse_shorts_list() {
            if (!this.shorts_list || this.shorts_list.length === 0) return;
            const { id, title, views_lable, thumbnail_url } = this.shorts_list.pop();

            this.get_shorts_info(id).then((author_info) => {
                const { author_id, author_name, upload_date } = author_info;
                if (author_id && user_data.channel_infos.ids.includes(author_id)) {
                    if (user_data.shorts_list.some((value) => { return value.id === id; })) {
                        log('已存在' + author_name + '的短视频：' + title, 0);
                    } else {
                        log('不过滤' + author_name + '的短视频：' + title, 0);
                        const shorts_info = {
                            id: id,
                            title: title,
                            author_id: author_id,
                            author_name: author_name,
                            views_lable: views_lable,
                            from: page_type,
                            // orgin_item: video_info,
                            thumbnail_url: thumbnail_url,
                            upload_date: upload_date
                        };
                        user_data.shorts_list.push(shorts_info);
                        user_data_api.set();
                    }
                } else {
                    log('过滤' + author_name + '的短视频：' + title, 0);
                }
            }).finally(() => {
                if (this.shorts_list.length > 0)
                    setTimeout(() => { this.parse_shorts_list(); }, shorts_parse_delay);
                else
                    this.parsing = false;
            });

        }
        check_shorts_exist(){
            /*
            const short_id = href.split('/').pop();
            for (const shorts of user_data.shorts_list) {
                if (shorts.id === short_id) {
                    user_data.shorts_list.pop(shorts);
                    user_data_api.set();
                    break;
                }
            }
            */
        }

        get_interval_tag(upload_date_str) {
            let uploadDate;
            try{
                uploadDate = new Date(upload_date_str);
            }catch(e){}
            if (!uploadDate || +uploadDate < 1706713200000) return "";
            const currentDate = new Date();
            const timeDifference = Math.abs(currentDate - uploadDate); // Difference in milliseconds
            const secondsDifference = timeDifference / 1000;
            const minutesDifference = secondsDifference / 60;
            const hoursDifference = minutesDifference / 60;
            const daysDifference = hoursDifference / 24;
            const weeksDifference = daysDifference / 7;
            const monthsDifference = weeksDifference / 4.345; // Average number of weeks in a month
            const yearsDifference = monthsDifference / 12;
            if (secondsDifference < 60) {
                return `${Math.floor(secondsDifference)} seconds ago`;
            } else if (minutesDifference < 60) {
                return `${Math.floor(minutesDifference)} minutes ago`;
            } else if (hoursDifference < 24) {
                return `${Math.floor(hoursDifference)} hours ago`;
            } else if (daysDifference < 7) {
                return `${Math.floor(daysDifference)} days ago`;
            } else if (weeksDifference < 4.345) {
                return `${Math.floor(weeksDifference)} weeks ago`;
            } else if (monthsDifference < 12) {
                return `${Math.floor(monthsDifference)} months ago`;
            } else {
                return `${Math.floor(yearsDifference)} years ago`;
            }
        }

    }
    return new ShortsFun;
}

function get_yt_api() {
    return {
        get_subscribe_data: function (retry = 0) {
            const headers = {
                "authority": "www.youtube.com",
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            };
            const url = "https://www.youtube.com/feed/channels";
            const requestConfig = {
                method: 'GET',
                headers: headers,
                url: url
            };
            GM_xmlhttpRequest({
                ...requestConfig,
                onload: function (response) {
                    let tmp_channel_names = [], tmp_channel_ids = [];
                    let regex = /var ytInitialData \= (.*?);\<\/script\>/;
                    try {
                        let match = response.responseText.match(regex);
                        let ytInitialData_obj = JSON.parse(match[1]);
                        let items = ytInitialData_obj.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].shelfRenderer.content.expandedShelfContentsRenderer.items;
                        for (let item of items) {
                            let channel_name = item.channelRenderer.title.simpleText;
                            const match_channel_id = item.channelRenderer.channelId;
                            tmp_channel_ids.push(match_channel_id);
                            tmp_channel_names.push(channel_name);
                        }
                        if (tmp_channel_ids.length > 0) {
                            user_data.channel_infos.ids = tmp_channel_ids;
                            user_data.channel_infos.names = tmp_channel_names;
                            user_data_api.set();
                        }
                        log('获取关注列表成功' + user_data.channel_infos.ids.length + '个', 0);
                    } catch (error) {
                        if (retry < 3) {
                            setTimeout(() => { get_subscribe_data(retry + 1); }, 1000);
                        }
                        log('获取关注列表失败\n', error, -1);
                    }
                },
                onerror: function (error) {
                    if (retry < 3) {
                        setTimeout(() => { get_subscribe_data(retry + 1); }, 1000);
                    }
                    log('获取关注列表失败\n', error, -1);
                },
            });
        },
        get_authorization: function () {
            function Vja() {
                function a() {
                    e[0] = 1732584193;
                    e[1] = 4023233417;
                    e[2] = 2562383102;
                    e[3] = 271733878;
                    e[4] = 3285377520;
                    u = q = 0;
                }
                function b(x) {
                    for (var y = l, C = 0; 64 > C; C += 4)
                        y[C / 4] = x[C] << 24 | x[C + 1] << 16 | x[C + 2] << 8 | x[C + 3];
                    for (C = 16; 80 > C; C++)
                        x = y[C - 3] ^ y[C - 8] ^ y[C - 14] ^ y[C - 16],
                            y[C] = (x << 1 | x >>> 31) & 4294967295;
                    x = e[0];
                    var E = e[1]
                        , H = e[2]
                        , R = e[3]
                        , T = e[4];
                    for (C = 0; 80 > C; C++) {
                        if (40 > C) {
                            if (20 > C) {
                                var X = R ^ E & (H ^ R);
                                var la = 1518500249;
                            } else
                                X = E ^ H ^ R,
                                    la = 1859775393;
                        } else
                            60 > C ? (X = E & H | R & (E | H),
                                la = 2400959708) : (X = E ^ H ^ R,
                                    la = 3395469782);
                        X = ((x << 5 | x >>> 27) & 4294967295) + X + T + la + y[C] & 4294967295;
                        T = R;
                        R = H;
                        H = (E << 30 | E >>> 2) & 4294967295;
                        E = x;
                        x = X;
                    }
                    e[0] = e[0] + x & 4294967295;
                    e[1] = e[1] + E & 4294967295;
                    e[2] = e[2] + H & 4294967295;
                    e[3] = e[3] + R & 4294967295;
                    e[4] = e[4] + T & 4294967295;
                }
                function c(x, y) {
                    if ("string" === typeof x) {
                        x = unescape(encodeURIComponent(x));
                        for (var C = [], E = 0, H = x.length; E < H; ++E)
                            C.push(x.charCodeAt(E));
                        x = C;
                    }
                    y || (y = x.length);
                    C = 0;
                    if (0 == q)
                        for (; C + 64 < y;)
                            b(x.slice(C, C + 64)),
                                C += 64,
                                u += 64;
                    for (; C < y;)
                        if (h[q++] = x[C++],
                            u++,
                            64 == q)
                            for (q = 0,
                                b(h); C + 64 < y;)
                                b(x.slice(C, C + 64)),
                                    C += 64,
                                    u += 64;
                }
                function d() {
                    var x = []
                        , y = 8 * u;
                    56 > q ? c(m, 56 - q) : c(m, 64 - (q - 56));
                    for (var C = 63; 56 <= C; C--)
                        h[C] = y & 255,
                            y >>>= 8;
                    b(h);
                    for (C = y = 0; 5 > C; C++)
                        for (var E = 24; 0 <= E; E -= 8)
                            x[y++] = e[C] >> E & 255;
                    return x;
                }
                for (var e = [], h = [], l = [], m = [128], p = 1; 64 > p; ++p)
                    m[p] = 0;
                var q, u;
                a();
                return {
                    reset: a,
                    update: c,
                    digest: d,
                    digestString: function () {
                        for (var x = d(), y = "", C = 0; C < x.length; C++)
                            y += "0123456789ABCDEF".charAt(Math.floor(x[C] / 16)) + "0123456789ABCDEF".charAt(x[C] % 16);
                        return y;
                    }
                };
            }
            const sapisid_cookie = getCookie('SAPISID') || getCookie('APISID') || getCookie('__Secure-3PAPISID');
            if (sapisid_cookie) {
                const timestamp = Math.floor(Date.now() / 1000);
                b = Vja();
                b.update(timestamp + ' ' + sapisid_cookie + ' https://www.youtube.com');
                const hash_value = b.digestString().toLowerCase();
                return 'SAPISIDHASH ' + timestamp + '_' + hash_value;
            }
            return '';
        },
        get_channel_id: function (retry = 0) {
            const authorization = this.get_authorization();
            if (!authorization) {
                log('获取authorization失败', 0);
                return;
            }
            const url = "https://www.youtube.com/youtubei/v1/account/account_menu";
            const params = {
                "prettyPrint": "false"
            };
            const data = {
                "context": {
                    "client": {
                        "clientName": "WEB",
                        "clientVersion": "2.20240308.00.00",
                    },
                },
            };
            const jsonData = JSON.stringify(data);
            const headers = {
                "authorization": authorization,
                "content-type": "application/json",
                "origin": "https://www.youtube.com",
                "referer": "https://www.youtube.com/",
            };
            const requestConfig = {
                method: 'POST',
                headers: headers,
                data: jsonData,
                url: url + "?" + new URLSearchParams(params),
            };

            GM_xmlhttpRequest({
                ...requestConfig,
                onload: function (response) {
                    const match = response.responseText.match(/"browseId"\:"(.*?)"/);
                    if (match && match.length > 1) {
                        let tmp_id = match[1];
                        if (tmp_id && tmp_id != channel_id) {
                            channel_id = tmp_id;
                            const tmp_data = user_data_api.get();
                            Object.assign(user_data, tmp_data);
                            GM_setValue('last_channel_id', channel_id);
                        }
                        log('获取channel_id成功' + channel_id, 0);
                    } else {
                        if (retry < 3) {
                            setTimeout(() => { yt_api.get_channel_id(retry + 1); }, 1000);
                        } else {
                            log('获取channel_id失败', response, response.responseText, -1);
                        }
                    }
                },
                onerror: function (error) {
                    if (retry < 3) {
                        setTimeout(() => { yt_api.get_channel_id(retry + 1); }, 1000);
                        yt_api.get_channel_id(retry + 1);
                    } else {
                        log('获取channel_id失败', error, 0);
                    }
                },
            });
        }
    };
}

function get_user_data_api() {
    return {
        get() {
            const default_user_data = {
                "open_recommend_shorts": 'off',
                "open_recommend_movie": 'off',
                "open_recommend_popular": 'off',
                "open_recommend_liveroom": 'off',
                "open_recommend_playables": "off",
                "add_shorts_upload_date": 'on',
                "shorts_change_author_name": 'off',
                "language": 'zh-CN',
                "channel_infos": {
                    "ids": [],
                    "names": []
                },
                "shorts_list": [],
                "login": false
            };
            let diff = false;
            let tmp_user_data = GM_getValue(channel_id);
            if (!tmp_user_data) {
                tmp_user_data = default_user_data;
                diff = true;
            }
            for (let key in default_user_data) {
                if (!(key in tmp_user_data)) {
                    diff = true;
                    tmp_user_data[key] = default_user_data[key];
                }
            }
            let tmp_login = channel_id !== 'default';
            if (tmp_user_data.login !== tmp_login) {
                diff = true;
                tmp_user_data.login = tmp_login;
            }
            (diff || this.update(tmp_user_data)) && GM_setValue(channel_id, tmp_user_data);
            return tmp_user_data;
        },
        set() {
            return GM_setValue(channel_id, user_data);
        },
        update(tmp_user_data) {
            let diff = false;
            last_version = GM_getValue('last_version', -1);
            if (last_version === -1) {
                tmp_user_data.open_recommend_shorts = GM_getValue("open_recommend_shorts", "off");
                tmp_user_data.open_recommend_movie = GM_getValue("open_recommend_movie", "off");
                tmp_user_data.open_recommend_popular = GM_getValue("open_recommend_popular", "off");
                tmp_user_data.open_recommend_liveroom = GM_getValue("open_recommend_liveroom", "off");
                diff = true;
            }
            if (typeof (tmp_user_data.open_recommend_shorts) === 'boolean') {
                tmp_user_data.open_recommend_shorts = tmp_user_data.open_recommend_shorts ? 'on' : 'off';
                tmp_user_data.open_recommend_movie = tmp_user_data.open_recommend_movie ? 'on' : 'off';
                tmp_user_data.open_recommend_popular = tmp_user_data.open_recommend_popular ? 'on' : 'off';
                tmp_user_data.open_recommend_liveroom = tmp_user_data.open_recommend_liveroom ? 'on' : 'off';
                diff = true;
            }
            last_version !== GM_info.script.version && GM_setValue("last_version", GM_info.script.version);
            return diff;
        },
        getLatestValues(tmp_user_data){
            const latest_user_data = GM_getValue(channel_id);
            if (latest_user_data) {
                Object.assign(tmp_user_data, latest_user_data);
            }
        }
    };
}