// ==UserScript==
// @name         YouTube视频&音乐&儿童广告拦截
// @name:zh-CN   YouTube视频&音乐&儿童广告拦截
// @name:zh-TW   YouTube視頻&音樂&兒童廣告攔截
// @name:zh-HK   YouTube視頻&音樂&兒童廣告攔截
// @name:en      YouTubeVideo&music&kidsAdBlocking
// @namespace    http://tampermonkey.net/
// @version      1.3.1.002
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
// @connect      https://update.greasyfork.org/
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @icon https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-start
// @license      MIT
// ==/UserScript==

/**
 * 
 * This is for testing only
 * 
 * The script is credited to "随便啦..." ( https://greasyfork.org/zh-TW/users/1205660-%E9%9A%8F%E4%BE%BF%E5%95%A6 )
 * License: MIT
 * 
 * For any issue, please report to https://greasyfork.org/scripts/480192/
 * 
 * 
 */

// testing
const HACK_ytInitialPlayerResponse = true;
const HACK_ytInitialData = true;
const HACK_userAgent = true;
const HACK_createElement = true;
const HACK_fetch = true;
const HACK_Request = true;
const HACK_XHR = true;
// testing
const DISABLE_CHECK_UPDATE = true;

const open_config_keyword = '2333'

const display_error_keyword = '2444'

let channel_id = GM_getValue('last_channel_id', 'default')

let user_data = GM_getValue(channel_id, {
    "open_recommend_shorts": false,
    "open_recommend_movie": false,
    "open_recommend_popular": false,
    "open_recommend_liveroom": false,
    "language": 'zh-CN',
    "channel_infos": {
        "ids": [],
        "names": []
    }
})

let open_recommend_tv_goodselect = false

let open_recommend_featured = false

let tmp_debugger_value

let limit_eval = false

let inject_info = {
    "ytInitialPlayerResponse": false,
    "ytInitialData": false,
    "xhr": false,
    "fetch": false
}

let account_login = false
let orgin_log = console.log
const script_url = 'https://update.greasyfork.org/scripts/480192/youtube%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA.user.js'
let href = location.href
let home_page_ytInitialData_ad_rule
let watch_page_ytInitialData_ad_rule
let ytInitialPlayerResponse_ad_rule = [
    "abs:playerAds=-",
    "abs:adPlacements=-",
    "abs:adBreakHeartbeatParams=-",
    "abs:adSlots=-",
]
let playlist_Response_ad_rule = [
    "abs:[2].playerResponse.playerAds=-",
    "abs:[2].playerResponse.adPlacements=-",
    "abs:[2].playerResponse.adBreakHeartbeatParams=-",
    "abs:[2].playerResponse.adSlots=-",
]
let open_debugger = true
let isinint = false
let mobile_web
let movie_channel_info
let mobile_movie_channel_info
let flag_info

let debugger_ytInitialPlayerResponse
let debugger_ytInitialData
let page_type
let error_messages = []
let data_process
const SPLIT_TAG = '###'

class DATA_PROCESS {
    constructor() {
        try {
            let tmp
            eval('1===1')
            this.limit_eval = false
        } catch (error) {
            this.limit_eval = true
        }
        this.obj_filter
        this.obj_storage = {}
    }
    storage_obj(key, obj) {
        this.obj_storage[key] = obj
    }
    set_obj_filter = function (obj_filter) {
        this.obj_filter = typeof obj_filter === 'function' ? obj_filter : undefined
    }
    text_process(data, values, mode, traverse_all) {
        mode = mode || 'cover'
        if (mode === 'reg') {
            for (let value of values) {
                let patten_express = value.split(SPLIT_TAG)[0]
                let replace_value = value.split(SPLIT_TAG)[1]
                let patten = new RegExp(patten_express, "g")
                data = data.replace(patten, replace_value)
            }
        }
        if (mode === 'cover') {
            data = values[0]
        }
        if (mode === 'insert') {
            traverse_all = traverse_all || false
            let json_data
            try {
                json_data = JSON.parse(data)
            } catch (error) {
                log('text_process JSON parse error', -1)
                return data
            }
            this.obj_process(json_data, values, traverse_all)
            data = JSON.stringify(json_data)
        }
        return data
    }

    value_parase(parase_value) {
        const json_math = parase_value.match(/^json\((.*)\)$/)
        if (json_math) return JSON.parse(json_math[1])
        const obj_match = parase_value.match(/^obj\((.*)\)$/)
        if (obj_match) return this.string_to_value(unsafeWindow, 'unsafeWindow.' + obj_match[1])
        const number_match = parase_value.match(/^num\((.*)\)$/)
        if (number_match) return Number(number_match[1])
        if (parase_value === 'undefined') return undefined
        if (parase_value === 'null') return null
        return parase_value
    }
    string_to_value(obj, path) {
        try {
            if (!this.limit_eval) {
                return eval(path.replace('json_obj', 'obj'))
            }
            let tmp_obj = obj
            let matches = path.match(/\[(.*?)\]/g)
            if (matches) {
                matches.map((match) => {
                    if (match.indexOf('["') > -1) {
                        tmp_obj = Reflect.get(tmp_obj, match.replace(/\["|"\]/g, ''))
                    } else {
                        tmp_obj = Reflect.get(tmp_obj, Number(match.replace(/\[|\]/g, '')))
                    }
                })
                return tmp_obj
            }
            matches = path.split('.')
            if (matches) {
                matches.splice(0, 1)
                matches.map((match) => {
                    tmp_obj = Reflect.get(tmp_obj, match)
                })
                return tmp_obj
            }
        } catch (error) {
            // log('获取属性值失败--->' + path, 'obj_process')
        }
    }

    get_lastPath_and_key(path) {
        let last_path, last_key
        let matches = path.match(/\[(.*?)\]/g)
        if (matches && matches.length > 0) {
            const tmp = matches[matches.length - 1]
            if (tmp.indexOf('["') > -1) {
                last_key = tmp.replace(/\["|"\]/g, '')
            } else {
                last_key = Number(tmp.replace(/\[|\]/g, ''))
            }
            last_path = path.substring(0, path.lastIndexOf(tmp))
        }
        if (!matches) {
            matches = path.split('.')
            if (matches && matches.length > 0) {
                last_key = matches[matches.length - 1]
                last_path = path.replace('.' + last_key, '')
            }
        }

        return [last_path, last_key]

    }

    obj_process(json_obj, express_list, traverse_all = false) {
        let data_this = this
        let abs_path_info_list = []
        let relative_path_info_list = []
        let relative_path_list = []
        let relative_short_path_list = []
        if (!json_obj || !express_list) return
        const is_array_obj = Array.isArray(json_obj)
        function add_data_to_abs_path(path, express, relative_path, operator, value, condition, array_index, path_extral) {
            let tmp
            path = path.replace(/\.[\d\w\-\_\$@]+/g, function (match) {
                return '["' + match.slice(1) + '"]'
            })
            if (array_index !== "*") {
                tmp = {}
                path = path + (array_index ? '[' + array_index + ']' : '')
                tmp.path = path
                tmp.relative_path = relative_path
                tmp.operator = operator
                tmp.value = value
                tmp.condition = condition
                tmp.path_extral = path_extral
                tmp.express = express
                abs_path_info_list.push(tmp)
                return
            }
            let array_length
            try {
                array_length = data_this.string_to_value(json_obj, path).length
                if (!array_length) return
            } catch (error) {
                return
            }
            for (let tmp_index = array_length - 1; tmp_index >= 0; tmp_index--) {
                tmp = {}
                tmp.path = path + "[" + tmp_index + "]"
                tmp.operator = operator
                tmp.value = value
                tmp.condition = condition
                tmp.path_extral = path_extral
                tmp.relative_path = relative_path
                tmp.express = express
                abs_path_info_list.push(tmp)
            }
        }

        function obj_property_traverse(obj, cur_path, dec_infos, dec_list, dec_index_list, traverse_all = false) {
            if (Array.isArray(obj)) {
                obj.forEach((tmp_obj, index) => {
                    let tmp_path = cur_path + '[' + index + ']'
                    if (!tmp_obj || typeof (tmp_obj) !== 'object') return
                    obj_property_traverse(tmp_obj, tmp_path, dec_infos, dec_list, dec_index_list, traverse_all)
                })
                return
            }
            Object.keys(obj).forEach((key) => {
                let tmp_path = cur_path + '.' + key
                let deal = false
                for (let i = 0; i < dec_infos["short_keys"].length; i++) {
                    if (dec_infos["short_keys"][i] === key) {
                        let len = dec_infos["real_keys"][i].length
                        if (tmp_path.slice(tmp_path.length - len) === dec_infos["real_keys"][i]) {
                            dec_list.push(tmp_path)
                            dec_index_list.push(i)
                            if (!deal && traverse_all && typeof (obj[key]) === 'object') {
                                obj_property_traverse(obj[key], tmp_path, dec_infos, dec_list, dec_index_list, traverse_all)
                            }
                            deal = true
                        }
                    }
                }
                let value = obj[key]
                if (deal || !value || typeof (value) !== 'object') return
                obj_property_traverse(value, tmp_path, dec_infos, dec_list, dec_index_list, traverse_all)
            })
        }

        function obj_modify(json_obj, path_info) {
            let path = path_info['deal_path']
            let operator = path_info['operator']
            let value = path_info['value']
            let [last_path, last_key] = data_this.get_lastPath_and_key(path)
            let last_obj = data_this.string_to_value(json_obj, last_path)
            if (operator === '=-') {
                let is_array = typeof last_key === 'number'
                if (!last_obj) throw new Error('last_obj is null')
                if (is_array)
                    last_obj.splice(last_key, 1)
                else
                    delete last_obj[last_key]
                log('依据：' + path_info.express, 'obj_process')
                log('删除属性-->' + path, 'obj_process')
                return
            }
            let dec_obj = last_obj[last_key]
            if (operator === '=+') {
                value = data_this.value_parase(value)
                if (dec_obj === null || dec_obj === undefined) throw new Error('dec_obj is null')
                let type_ = typeof dec_obj
                if (Array.isArray(dec_obj)) type_ = 'array'
                if (type_ === 'array') last_obj[last_key].push(value)
                if (type_ === 'string' || type_ === 'number') last_obj[last_key] = last_obj[last_key] + value
                log('依据：' + path_info.express, 'obj_process')
                log('修改属性-->' + path, 'obj_process')
            }
            if (operator === '~=') {
                let search_value = value.split(SPLIT_TAG)[0]
                let replace_value = value.split(SPLIT_TAG)[1]
                last_obj[last_key] = dec_obj.replace(new RegExp(search_value, 'g'), replace_value)
                log('依据：' + path_info.express, 'obj_process')
                log('修改属性-->' + path, 'obj_process')
            }
            if (operator === '=') {
                value = data_this.value_parase(value)
                last_obj[last_key] = value
                log('依据：' + path_info.express, 'obj_process')
                log('修改属性-->' + path, 'obj_process')
            }
        }

        express_list.forEach(express => {
            if (!express) return
            let reg
            let express_type = typeof (express)
            let matchs
            let conditions
            let value
            reg = /^(abs:)?([a-zA-Z_0-9\.\*\[\]]*)((=\-|~=|=\+|=))(.*)?/
            if (express_type === 'string') {
                matchs = express.match(reg)
            } else {
                matchs = express.value.match(reg)
                conditions = express.conditions
            }
            let abs = matchs[1]
            let path = matchs[2]
            let path_extral_match = path.match(/\/?\.+$/)
            let path_extral
            if (path_extral_match) {
                path_extral = {}
                let len
                if (path_extral_match[0].indexOf('/') === 0) {
                    len = path_extral_match[0].length - 1
                    path_extral['child'] = len
                } else {
                    len = path_extral_match[0].length
                    path_extral['parent'] = len
                }
                path = path.slice(0, path.length - len)
            }
            let operator = matchs[3]
            if (express_type === 'string') {
                let tmp_value = matchs[5] || ''
                let split_index = tmp_value.indexOf(' ')
                if (split_index > -1) {
                    value = tmp_value.substring(0, split_index)
                    conditions = tmp_value.substring(split_index + 1)
                    conditions = {
                        'value': [conditions]
                    }
                } else {
                    value = tmp_value
                }
            }
            matchs = path.match(/\[(\*?\d*)\]$/)
            let array_index
            if (matchs) {
                path = path.replace(/\[(\*?\d*)\]$/, '')
                array_index = matchs[1]
            }
            if (abs) {
                add_data_to_abs_path(`json_obj${is_array_obj ? '' : '.'}` + path, express, path, operator, value, conditions, array_index, path_extral)
            } else {
                relative_path_list.push(path)
                let tmp_short_path = path.split('.').pop()
                relative_short_path_list.push(tmp_short_path)
                relative_path_info_list.push({
                    "express": express,
                    "path": path,
                    "operator": operator,
                    "value": value,
                    "conditions": conditions,
                    "array_index": array_index,
                    "path_extral": path_extral
                })
            }
        })
        if (relative_path_list.length > 0) {
            let dec_list = []
            let dec_index_list = []
            obj_property_traverse(json_obj, '', {
                "short_keys": relative_short_path_list,
                "real_keys": relative_path_list
            }, dec_list, dec_index_list, traverse_all)
            for (let i = 0; i < dec_index_list.length; i++) {
                let real_index = dec_index_list[i]
                let real_path_info = relative_path_info_list[real_index]
                let tmp_path = 'json_obj' + dec_list[i]
                add_data_to_abs_path(tmp_path, real_path_info.express, real_path_info.path, real_path_info.operator, real_path_info.value, real_path_info.conditions, real_path_info.array_index, real_path_info.path_extral)
            }
        }
        abs_path_info_list.sort((a, b) => a < b ? 1 : -1)
        for (let path_info of abs_path_info_list) {
            if (!this.obj_conditional(path_info, json_obj)) continue
            let operator = path_info.operator
            let path = path_info.path
            let value = path_info.value
            let path_extral = path_info.path_extral
            if (path_extral) {
                let positions = []
                let regex = /\]/g
                let match
                while ((match = regex.exec(path)) !== null) {
                    positions.push(match.index)
                }
                if (positions.length === 0) continue
                if ('parent' in path_extral) {
                    if (positions.length - path_extral['parent'] - 1 < 0) continue
                    let split_index = positions[positions.length - path_extral['parent'] - 1] + 1
                    path = path.slice(0, split_index)
                }
            }
            path_info.deal_path = path
            if (this.obj_filter && this.obj_filter(path_info, json_obj)) continue
            obj_modify(json_obj, path_info)
        }
    }

    value_conditional(value, condition_express) {
        let reg = /(\$text|\$value|\$exist|\$notexist)?((>=|<=|>|<|!~=|!=|~=|=))?(.*)/
        let match = condition_express.match(reg)
        let condition_type = match[1] || '$text'
        let condition_operator = match[2]
        let condition_test_value = match[4]

        if (condition_type === '$value') {
            if (!['>=', '<=', '>', '<', '='].includes(condition_operator)) return false
            if (condition_operator === '=') return condition_test_value === value
            if (condition_operator === '>=') return value >= condition_test_value
            if (condition_operator === '<=') return value <= condition_test_value
            if (condition_operator === '>') return value > condition_test_value
            if (condition_operator === '<') return value < condition_test_value
        }
        if (condition_type === '$exist') {
            return value !== undefined && value !== null
        }
        if (condition_type === '$notexist') {
            return value === undefined || value === null
        }
        if (condition_type === '$text') {
            if (typeof (value) === 'object') value = JSON.stringify(value)
            if (condition_operator === '!=') return condition_test_value !== value
            if (condition_operator === '=') return condition_test_value === value
            if (condition_operator === '~=') return new RegExp(condition_test_value).test(value)
            if (condition_operator === '!~=') return !new RegExp(condition_test_value).test(value)
            if (condition_operator === '>=') return value.length >= condition_test_value.length
            if (condition_operator === '>') return value.length > condition_test_value.length
            if (condition_operator === '<=') return value.length <= condition_test_value.length
            if (condition_operator === '>') return value.length > condition_test_value.length
        }
        return false
    }

    obj_conditional(express_info, json_obj) {
        //json_obj 在eval里直接调用
        if (!express_info['condition']) return true
        let condition_infos = express_info['condition']
        // 与 
        for (let condition_list of Object.values(condition_infos)) {
            let result = false
            for (let condition of condition_list) {
                let reg = /^([a-zA-Z_0-9\/\.\[\]]*)?(.*)/
                let match = condition.match(reg)
                let condition_path = match[1]
                let mod
                if (condition_path) {
                    if (condition_path.indexOf('/') === 0) {
                        mod = 'child'
                    } else if (condition_path.indexOf('.') === 0) {
                        mod = 'parent'
                    } else {
                        mod = 'other'
                    }
                } else {
                    condition_path = express_info.path
                }
                let conditional_express = match[2]
                if (mod === 'child') {
                    condition_path = express_info.path + condition_path.slice(1).replace(/\.[\d\w\-\_\$@]+/g, function (match) {
                        return '["' + match.slice(1) + '"]'
                    })
                }
                if (mod === 'parent') {
                    let reg = /^\.+/
                    let matchs = condition_path.match(reg)
                    let positions = []
                    let regex = /\]/g
                    while ((match = regex.exec(express_info.path)) !== null) {
                        positions.push(match.index)
                    }
                    if (positions.length > 0) {
                        let split_index = positions[positions.length - matchs[0].length - 1] + 1
                        let short_condition_path = condition_path.replace(reg, '')
                        if (!/^\[/.test(short_condition_path)) {
                            short_condition_path = '.' + short_condition_path
                        }
                        condition_path = express_info.path.slice(0, split_index) + short_condition_path.replace(/\.[\d\w\-\_\$@]+/g, function (match) {
                            return '["' + match.slice(1) + '"]'
                        })
                    }
                }
                if (mod === 'other') {
                    condition_path = (`json_obj${is_array_obj ? '' : '.'}` + condition_path).replace(/\.[\d\w\-\_\$@]+/g, function (match) {
                        return '["' + match.slice(1) + '"]'
                    })
                }
                let condition_value
                try {
                    condition_value = this.string_to_value(json_obj, condition_path)
                } catch (error) {
                    continue
                }
                result = this.value_conditional(condition_value, conditional_express)
                if (result) {
                    express_info.condition_value = condition_value
                    log('条件成立-->', condition_value, 'obj_process')
                    break
                }
            }
            if (!result) return false
        }
        return true
    }
}

let yt_api = {
    get_subscribe_data: function (retry = 0) {
        if (!account_login) return
        const headers = {
            "authority": "www.youtube.com",
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        };
        const url = "https://www.youtube.com/feed/channels"
        const requestConfig = {
            method: 'GET',
            headers: headers,
            url: url
        };
        GM_xmlhttpRequest({
            ...requestConfig,
            onload: function (response) {
                let tmp_channel_names = [], tmp_channel_ids = []
                let regex = /var ytInitialData \= (.*?);\<\/script\>/;
                try {
                    let match = response.responseText.match(regex);
                    let ytInitialData_obj = JSON.parse(match[1])
                    let items = ytInitialData_obj.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].shelfRenderer.content.expandedShelfContentsRenderer.items
                    for (let item of items) {
                        let channel_name = item.channelRenderer.title.simpleText
                        let channel_id = item.channelRenderer.channelId
                        tmp_channel_ids.push(channel_id)
                        tmp_channel_names.push(channel_name)
                    }
                    if (tmp_channel_ids.length > 0) {
                        user_data.channel_infos.ids = tmp_channel_ids
                        user_data.channel_infos.names = tmp_channel_names
                        GM_setValue(channel_id, user_data)
                    }
                    log('获取关注列表成功' + user_data.channel_infos.ids.length + '个', 0)
                } catch (error) {
                    if (retry < 3) {
                        setTimeout(() => { get_subscribe_data(retry + 1) }, 1000)
                    }
                    log('获取关注列表失败\n', error, -1)
                }
            },
            onerror: function (error) {
                if (retry < 3) {
                    setTimeout(() => { get_subscribe_data(retry + 1) }, 1000)
                }
                log('获取关注列表失败\n', error, -1)
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
                u = q = 0
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
                            var la = 1518500249
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
                    x = X
                }
                e[0] = e[0] + x & 4294967295;
                e[1] = e[1] + E & 4294967295;
                e[2] = e[2] + H & 4294967295;
                e[3] = e[3] + R & 4294967295;
                e[4] = e[4] + T & 4294967295
            }
            function c(x, y) {
                if ("string" === typeof x) {
                    x = unescape(encodeURIComponent(x));
                    for (var C = [], E = 0, H = x.length; E < H; ++E)
                        C.push(x.charCodeAt(E));
                    x = C
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
                                u += 64
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
                return x
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
                    return y
                }
            }
        }
        const sapisid_cookie = getCookie('SAPISID') || getCookie('APISID') || getCookie('__Secure-3PAPISID')
        if (sapisid_cookie) {
            const timestamp = Math.floor(new Date().getTime() / 1000)
            b = Vja()
            b.update(timestamp + ' ' + sapisid_cookie + ' https://www.youtube.com')
            const hash_value = b.digestString().toLowerCase()
            return 'SAPISIDHASH ' + timestamp + '_' + hash_value
        }
        return ''
    },
    get_channel_id: function (retry = 0) {
        const authorization = this.get_authorization();
        if (!authorization) {
            log('获取authorization失败', 0)
            return
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
                const match = response.responseText.match(/"browseId"\:"(.*?)"/)
                if (match && match.length > 1) {
                    let tmp_id = match[1]
                    if (tmp_id && tmp_id != channel_id) {
                        channel_id = tmp_id
                        user_data = GM_getValue(channel_id, {
                            "open_recommend_shorts": false,
                            "open_recommend_movie": false,
                            "open_recommend_popular": false,
                            "open_recommend_liveroom": false,
                            "language": 'zh-CN',
                            "channel_infos": {
                                "ids": [],
                                "names": []
                            }
                        })
                        GM_setValue('last_channel_id', channel_id)
                    }
                    log('获取channel_id成功' + channel_id, 0)
                } else {
                    if (retry < 3) {
                        setTimeout(() => { yt_api.get_channel_id(retry + 1) }, 1000)

                    } else {
                        debugger
                        log('获取channel_id失败', response, response.responseText, 0)
                    }
                }
            },
            onerror: function (error) {
                if (retry < 3) {
                    setTimeout(() => { yt_api.get_channel_id(retry + 1) }, 1000)
                    yt_api.get_channel_id(retry + 1)
                } else {
                    log('获取channel_id失败', error, 0)
                }
            },
        });
    },
}
url_observer()
init()

function init() {
    log('初始化开始！', 0)
    update_old_config()
    data_process = new DATA_PROCESS()
    data_process.set_obj_filter(obj_process_filter)
    try {
        eval('1===1')
        limit_eval = false
    } catch (error) {
        limit_eval = true
    }
    config_init(user_data.language)
    if (HACK_ytInitialPlayerResponse) {
        let ytInitialPlayerResponse_value = unsafeWindow['ytInitialPlayerResponse']
        define_property_hook(unsafeWindow, 'ytInitialPlayerResponse', {
            get: function () {
                return ytInitialPlayerResponse_value
            },
            set: function (value) {
                inject_info.ytInitialPlayerResponse = true
                if (value && open_debugger) debugger_ytInitialPlayerResponse = (typeof (value) === 'string') ? JSON.parse(value) : JSON.parse(JSON.stringify(value))
                let start_time = new Date().getTime()
                value && data_process.obj_process(value, ytInitialPlayerResponse_ad_rule, true)
                log('ytInitialPlayerResponse 时间：', new Date().getTime() - start_time, 'spend_time');
                ytInitialPlayerResponse_value = value
            },
            configurable: false
        });
    }

    if (HACK_ytInitialData) {
        let ytInitialData_value = unsafeWindow['ytInitialData']
        define_property_hook(unsafeWindow, 'ytInitialData', {
            get: function () {
                return ytInitialData_value
            },
            set: function (value) {
                inject_info.ytInitialData = true
                let start_time = new Date().getTime()
                let y_type = typeof (value)
                if (open_debugger && value !== undefined && value !== null) debugger_ytInitialData = (y_type === 'string') ? JSON.parse(value) : JSON.parse(JSON.stringify(value))
                if (value && y_type === 'string') {
                    value = JSON.parse(value)
                }
                // debugger
                if (/watch/.test(href)) {
                    value && data_process.obj_process(value, watch_page_ytInitialData_ad_rule, true)
                } else {
                    value && data_process.obj_process(value, home_page_ytInitialData_ad_rule, true)
                }
                if (y_type === 'string') value = JSON.stringify(value)
                ytInitialData_value = value
                log('ytInitialData 时间：', new Date().getTime() - start_time, 'spend_time')
            },
            configurable: false
        })
    }

    if (HACK_userAgent) {
        define_property_hook(navigator, 'userAgent', {
            get: function () {
                return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
            }
        })
    }

    if (HACK_createElement) {
        const origin_createElement = document.createElement
        document.createElement = function () {
            let node = origin_createElement.apply(this, arguments)
            if (arguments[0] === 'template') {
                let innerhtml_getter = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML").get;
                let innerhtml_setter = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML").set;
                define_property_hook(node, 'innerHTML', {
                    get: function () {
                        return innerhtml_getter.call(node)
                    },
                    set: function (value) {
                        // if (value.toString().indexOf('ytd-continuation-item-renderer')>-1){
                        //     if (href.indexOf('https://www.youtube.com/watch')>-1){
                        //         value = ''
                        //         log(value);
                        //         log('弹窗去掉------->ytd-continuation-item-renderer');
                        // }
                        if (value.toString().indexOf('yt-mealbar-promo-renderer') > -1) {
                            log('弹窗去掉------->yt-mealbar-promo-renderer', 'node_process');
                            value = ''
                        }
                        innerhtml_setter.call(node, value)
                    }
                })
            }
            return node
        }
        document.createElement.toString = origin_createElement.toString.bind(origin_createElement);
    }

    async function deal_resposn(name, response, rule) {
        const responseClone = response.clone();
        let result = await responseClone.text()
        if (name === 'subscribe' || name === 'unsubscribe') {
            let match_list = result.match(/channelId":\"(.*?)"/)
            let channel_id = match_list && match_list.length > 1 ? match_list[1] : ''
            let channel_infos = user_data.channel_infos
            if (channel_id) {
                if (name === 'unsubscribe') {
                    let index = channel_infos.ids.indexOf(channel_id)
                    if (index > -1) {
                        channel_infos.ids.splice(index, 1)
                        channel_infos.names.splice(index, 1)
                    }
                } else {
                    channel_infos.ids.push(channel_id)
                    channel_infos.names.push('')
                }
                user_data.channel_infos = channel_infos
                GM_setValue(channel_id, user_data)
            }
        } else {
            let start_time = new Date().getTime()
            result = data_process.text_process(result, rule, 'insert', true)
            log(name + ' 时间：', new Date().getTime() - start_time, 'spend_time');
        }
        if (!result) debugger
        return new Response(result, response)
    }
    const origin_fetch = unsafeWindow.fetch;
    if (origin_fetch.toString() !== 'function fetch() { [native code] }') {
        log('fetch have been modified', -1)
    }
    if (HACK_fetch) {
        unsafeWindow.fetch = function () {
            const fetch_ = async function (uri, options) {
                async function fetch_request(response) {
                    let url = response.url
                    inject_info.fetch = true
                    return_response = response
                    if (url.indexOf('youtubei/v1/next') > -1) {
                        return await deal_resposn('next', response, watch_page_ytInitialData_ad_rule)
                    }
                    if (url.indexOf('youtubei/v1/player') > -1) {
                        return await deal_resposn('player', response, ytInitialPlayerResponse_ad_rule)
                    }
                    if (url.indexOf('youtubei/v1/browse') > -1) {
                        let rule = home_page_ytInitialData_ad_rule
                        if (page_type === 'home' && !user_data.open_recommend_liveroom) {
                            let node, category_text
                            if (mobile_web) {
                                node = document.querySelector('#filter-chip-bar > div > ytm-chip-cloud-chip-renderer.selected')
                                category_text = node && node.textContent
                            } else {
                                node = document.querySelector('#chips > yt-chip-cloud-chip-renderer.style-scope.ytd-feed-filter-chip-bar-renderer.iron-selected')
                                category_text = node && node.querySelector('#text').textContent
                            }
                            const filter_list = [flag_info.category_game, flag_info.category_live, flag_info.category_news]
                            if (filter_list.includes(category_text)) {
                                let body
                                if (uri.body_) {
                                    try {
                                        body = JSON.parse(uri.body_)
                                    } catch (error) {
                                    }
                                }
                                if (!body || body.browseId !== 'FEwhat_to_watch') {
                                    rule = home_page_ytInitialData_ad_rule.filter(item => item.indexOf(flag_info.live) === -1)
                                }
                            }
                        }
                        return await deal_resposn('browse', response, rule)
                    }
                    if (url.indexOf('https://m.youtube.com/youtubei/v1/guide') > -1) {
                        return await deal_resposn('guide', response, home_page_ytInitialData_ad_rule)
                    }
                    if (url.indexOf('/youtubei/v1/search') > -1) {
                        return await deal_resposn('guide', response, home_page_ytInitialData_ad_rule)
                    }
                    if (url.indexOf('/unsubscribe?prettyPrint=false') > -1) {
                        return await deal_resposn('unsubscribe', response)
                    }
                    if (url.indexOf('/subscribe?prettyPrint=false') > -1) {
                        return await deal_resposn('subscribe', response)
                    }
                    return return_response
                }

                return origin_fetch(uri, options).then(fetch_request)
            }
            const names = Object.getOwnPropertyNames(origin_fetch);
            for (let i = 0; i < names.length; i++) {
                if (names[i] in fetch_)
                    continue;
                let desc = Object.getOwnPropertyDescriptor(origin_fetch, names[i])
                define_property_hook(fetch_, names[i], desc);
            }
            return fetch_
        }();
    }

    if (HACK_Request) {
        const origin_Request = unsafeWindow.Request;

        if (origin_Request.toString() !== 'function Request() { [native code] }') {
            log('Request have been modified', -1)
        }
        const requestBodyMap = new WeakMap();
        unsafeWindow.Request = class extends unsafeWindow.Request {
            constructor(input, options = void 0) {
                super(input, options);
                try {
                    const p = Object.getOwnPropertyDescriptor(options, 'body') || {};
                    if (typeof (p.value || 0) === "string") {
                        requestBodyMap.set(this, p.value);
                    }
                } catch (e) { }
            }
            get body_() {
                return requestBodyMap.get(this) || undefined;
            }
        };
    }

    if (HACK_XHR) {
        unsafeWindow.XMLHttpRequest = class extends unsafeWindow.XMLHttpRequest {
            open(method, url, ...opts) {
                inject_info.xhr = true;
                return super.open(method, url, ...opts);
            }
            get xhrResponseValue() {
                const xhr = this;
                let result = super.response;
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.responseURL.indexOf('youtubei/v1/player') > -1) {
                        result = data_process.text_process(result, ytInitialPlayerResponse_ad_rule, 'insert', true);
                    }
                    if (xhr.responseURL.indexOf('youtube.com/playlist') > -1) {
                        let obj;
                        try {
                            obj = JSON.parse(result);
                        } catch (error) {
                            log('JSON解析失败', 1);
                            return result;
                        }
                        data_process.obj_process(obj[2].playerResponse, ytInitialPlayerResponse_ad_rule, true);
                        data_process.obj_process(obj[3].response, watch_page_ytInitialData_ad_rule, true);
                        tmp_debugger_value = obj;
                        result = JSON.stringify(obj);
                    }
                } else {
                    result = '';
                }
                return result;
            }
            get responseText() {
                return this.xhrResponseValue;
            }
            get response() {
                return this.xhrResponseValue;
            }
        };
    }


    document.addEventListener('DOMContentLoaded', function () {
        !mobile_web && search_listener()
        check_update()
    })

    if (unsafeWindow.ytcfg) {
        if (unsafeWindow.ytcfg.data_ && typeof (unsafeWindow.ytcfg.data_.LOGGED_IN) === 'boolean') {
            account_login = unsafeWindow.ytcfg.data_.LOGGED_IN
            account_data_init()
        } else {
            if (unsafeWindow.ytcfg.data_ && typeof unsafeWindow.ytcfg.data_ === 'object') {
                define_property_hook(unsafeWindow.ytcfg.data_, 'LOGGED_IN', {
                    get: function () {
                        return unsafeWindow.ytcfg.data_.LOGGED_IN_
                    },
                    set: function (value) {
                        unsafeWindow.ytcfg.data_.LOGGED_IN_ = value
                        typeof (value) === 'boolean' && (account_login = value)
                        account_data_init()
                    }
                })
            }

        }
        if (unsafeWindow.ytcfg.data_ && unsafeWindow.ytcfg.data_.HL) config_init()
        !(unsafeWindow.ytcfg.data_ && unsafeWindow.ytcfg.data_.HL) && define_property_hook(unsafeWindow.ytcfg, 'msgs', {
            get: function () {
                return this._msgs
            },
            set: function (newValue) {
                if (newValue.__lang__) config_init()
                this._msgs = newValue;
            }
        })
    } else {
        define_property_hook(unsafeWindow, 'ytcfg', {
            get: function () {
                return this._ytcfg
            },
            set: function (newValue) {
                if (newValue.set) {
                    const orgin_set = newValue.set
                    newValue.set = function () {
                        orgin_set.apply(this, arguments)
                        if (arguments[0] && typeof arguments[0].LOGGED_IN === 'boolean') {
                            account_login = arguments[0].LOGGED_IN
                            account_data_init()
                        }
                        if (arguments[0].HL) {
                            config_init(arguments[0].HL)
                        }
                    }
                }
                this._ytcfg = newValue;
            }
        });
    }
    isinint = true
    log('初始化结束！', 0)
}

async function account_data_init() {
    if (account_login) {
        yt_api.get_channel_id()
        yt_api.get_subscribe_data()
    } else {
        channel_id = 'default'
        user_data = GM_getValue(channel_id, {
            "open_recommend_shorts": false,
            "open_recommend_movie": false,
            "open_recommend_popular": false,
            "open_recommend_liveroom": false,
            "language": 'zh-CN',
            "channel_infos": {
                "ids": [],
                "names": []
            }
        })
        GM_setValue('last_channel_id', channel_id)
    }
}

function filter_page() {
    let base_url = href.split('?')[0]
    let urls = ['youtube.com/watch', 'youtube.com/', 'youtube.com', 'youtube.com/playlist', 'youtubekids.com/watch']
    for (let [index, check_url] of urls.entries()) {
        if (new RegExp(check_url + '$').test(base_url)) {
            page_type = (index == 1 || index == 2) ? 'home' : 'watch'
            return false
        }
    }
    log(`过滤页面：${href}`, 0)
    return true
}
// 暂没用
function native_method_hook(method_path, handler) {
    let [last_path, last_key] = data_process.get_lastPath_and_key(method_path)
    let last_obj = data_process.string_to_value(unsafeWindow, 'unsafeWindow.' + last_path)
    let dec_obj = last_obj[last_key]
    last_obj[last_key + '__'] = dec_obj
    if (typeof dec_obj !== 'function') {
        log(method_path, 'have been modified', -1)
        return
    }
    const method_name = dec_obj.name
    if (dec_obj.toString() !== 'function ' + method_name + '() { [native code] }') {
        log(method_path, 'have been modified！', -1)
    }
    last_obj[last_key] = handler
}

function define_property_hook(obj, property, descriptor) {
    try {
        Object.defineProperty(obj, property, descriptor)
    } catch (error) {
        log("hook " + property + " failed！", -1)
        return
    }
    if (descriptor.get) {
        const get_ = Object.getOwnPropertyDescriptor(obj, property).get
        if (descriptor.get !== get_) {
            log("hook " + property + " failed！", -1)
            return
        }
    }
    if (descriptor.set) {
        const set_ = Object.getOwnPropertyDescriptor(obj, property).set
        if (descriptor.set !== set_)
            log("hook " + property + " failed！", -1)
    }
}

function config_init(tmp_language = null) {
    home_page_ytInitialData_ad_rule = undefined
    watch_page_ytInitialData_ad_rule = undefined
    if (isinint) {
        setTimeout(search_listener, 500)
    }
    if (filter_page()) return
    if (!tmp_language) {
        user_data.language = unsafeWindow['ytcfg'].msgs ? unsafeWindow['ytcfg'].msgs.__lang__ : unsafeWindow['ytcfg'].data_.HL
    } else {
        user_data.language = tmp_language
    }
    let flag_infos = {
        "zh-CN": {
            "sponsored": "赞助商广告",
            "free_movie": "免费（含广告）",
            "live": "直播",
            "movie_channel": "影视",
            "free_primetime_movie": "免费 Primetime 电影",
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
        },
        "zh-TW": {
            "sponsored": "贊助商廣告",
            "free_movie": "免費 \\(含廣告\\)",
            "live": "直播",
            "movie_channel": "電影與電視節目",
            "free_primetime_movie": "免費的特選電影",
            "think_video": "你對這部影片有什麼看法？|此推荐内容怎么样？",
            "try": "試用",
            "recommend_popular": "時下流行",
            "featured": "Featured",
            "category_live": "直播中",
            "category_game": "遊戲",
            "category_news": "新聞",
            "btn_recommend_movie": "电影推薦",
            "btn_recommend_shorts": "Shorts推薦",
            "btn_recommend_liveroom": "直播推薦",
            "btn_recommend_popular": "時下流行",
            "btn_save": "保存",
            "goodselect": "精選內容",
            "music_ad_flag": "无广告打扰",
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
        },
        "zh-HK": {
            "sponsored": "赞助",
            "free_movie": "免費 \\(有廣告\\)",
            "live": "直播",
            "movie_channel": "電影與電視節目",
            "free_primetime_movie": "免費黃金時段電影",
            "think_video": "你對此影片有何意見？|此推荐内容怎么样？",
            "try": "試用",
            "recommend_popular": "時下流行",
            "featured": "Featured",
            "category_live": "直播",
            "category_game": "遊戲",
            "category_news": "新聞",
            "btn_recommend_movie": "电影推薦",
            "btn_recommend_shorts": "Shorts推薦",
            "btn_recommend_liveroom": "直播推薦",
            "btn_recommend_popular": "時下流行",
            "btn_save": "保存",
            "goodselect": "精選內容",
            "music_ad_flag": "无广告打扰",
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
        },
        "en": {
            "sponsored": "Sponsored",
            "free_movie": "Free with ads",
            "live": "LIVE",
            "movie_channel": "Movies & TV",
            "free_primetime_movie": "Free Primetime movies",
            "think_video": "What did you think of this video?|此推荐内容怎么样？",
            "try": "试用",
            "recommend_popular": "Trending",
            "featured": "Featured",
            "category_live": "Live",
            "category_game": "Gaming",
            "category_news": "News",
            "btn_recommend_movie": "MovieRecommend",
            "btn_recommend_shorts": "ShortsRecommend",
            "btn_recommend_liveroom": "LiveRecommend",
            "btn_recommend_popular": "TrendingRecommend",
            "btn_save": "Save",
            "goodselect": "Featured",
            "music_ad_flag": "无广告打扰",
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
        }
    }
    if (['zh-CN', 'zh-TW', 'zh-HK', 'en'].indexOf(user_data.language) === -1) {
        log(`Does not support language ${user_data.language}, only supports zh-CN, zh-TW, zh-HK, en, and is compatible with English locations; there may be some errors.`, -1);
        user_data.language = user_data.language.indexOf('en-') === 0 ? 'en' : 'zh-CN'
    } else {
        user_data.language = user_data.language
    }
    GM_setValue(channel_id, user_data)
    flag_info = flag_infos[user_data.language]
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
    }
    unsafeWindow.movie_channel_info = movie_channel_info
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
    }
    unsafeWindow.mobile_movie_channel_info = mobile_movie_channel_info

    let column_recommend_rule
    let item_label_fifter_rule
    let watch_page_item_label_fifter_rule
    let home_page_item_label_fifter_rule
    let add_movie_channel_rule
    let music_premium_ad_rule
    mobile_web = href.indexOf('https://m.youtube.com/') > -1
    watch_page_ytInitialData_ad_rule = home_page_ytInitialData_ad_rule = null
    watch_page_ytInitialData_ad_rule = [
        'tvfilmOfferModuleRenderer=- /.masthead$exist',
        'merchandiseShelfRenderer=-',
        'adSlotRenderer.=-',
    ]
    if (href.indexOf('youtubekids.com/watch') > -1) {
        return
    }
    //打开直播频道
    let open_live_channel = href.indexOf('channel/UC4R8DWoMoI7CAwX8_LjQHig') > -1
    open_live_channel = false
    let open_movie_channel = href.indexOf('feed/storefront') > -1
    if (mobile_web) {
        column_recommend_rule = 'reelShelfRenderer.title.runs[0].text......=- ~='
        mobile_web_extra_column_recommend_rule = 'pivotBarItemRenderer.title.runs[0].text.....=- ~='
        // 直播规则
        let ad_label = 'metadataBadgeRenderer.label.....=- ~=' + flag_info.sponsored
        if (!user_data.open_recommend_movie && !open_movie_channel) ad_label += '|' + flag_info.free_movie
        item_label_fifter_rule = [ad_label]
        home_page_item_label_fifter_rule = watch_page_item_label_fifter_rule = item_label_fifter_rule
        if (!user_data.open_recommend_liveroom && !open_live_channel) {
            item_label_fifter_rule.push('text.accessibility.accessibilityData.label........=- =' + flag_info.live)
            home_page_item_label_fifter_rule = item_label_fifter_rule.concat(['thumbnailOverlayTimeStatusRenderer.text.runs[0].text.........=- =' + flag_info.upcoming])
            watch_page_item_label_fifter_rule = item_label_fifter_rule
        }
        add_movie_channel_rule = "loadingStrategy.inlineContent.moreDrawerViewModel.content=+obj(mobile_movie_channel_info) !~=" + flag_info.movie_channel
        music_premium_ad_rule = ""

    } else {
        column_recommend_rule = 'richShelfRenderer.title.runs[0].text......=- ~='
        let ad_label
        if (href.indexOf('watch') > -1) {
            ad_label = 'metadataBadgeRenderer.label.....=- ~=' + flag_info.sponsored
        } else {
            ad_label = 'metadataBadgeRenderer.label......=- ~=' + flag_info.sponsored
        }
        if (!user_data.open_recommend_movie && !open_movie_channel) ad_label += '|' + flag_info.free_movie
        item_label_fifter_rule = [ad_label]
        home_page_item_label_fifter_rule = watch_page_item_label_fifter_rule = item_label_fifter_rule
        if (!user_data.open_recommend_liveroom && !open_live_channel) {
            item_label_fifter_rule.push('text.accessibility.accessibilityData.label........=- =' + flag_info.live)
            watch_page_item_label_fifter_rule = item_label_fifter_rule.concat(['metadataBadgeRenderer.label.....=- =' + flag_info.live])
            home_page_item_label_fifter_rule = item_label_fifter_rule.concat(['metadataBadgeRenderer.label......=- =' + flag_info.live,
            'thumbnailOverlayTimeStatusRenderer.text.simpleText.......=- =' + flag_info.upcoming])
        }
        add_movie_channel_rule = "loadingStrategy.inlineContent.moreDrawerViewModel.content=+obj(movie_channel_info) !~=" + flag_info.movie_channel
        music_premium_ad_rule = 'richSectionRenderer.content.statementBannerRenderer.title.runs[0].text.......=- ~=Music Premium|' + flag_info.music_ad_flag
    }

    if (!open_recommend_tv_goodselect) {
        if (home_page_item_label_fifter_rule) {
            home_page_item_label_fifter_rule.push('metadataBadgeRenderer.label.......=- ~=' + flag_info.goodselect)
        } else {
            home_page_item_label_fifter_rule = ['metadataBadgeRenderer.label.......=- ~=' + flag_info.goodselect]
        }
    }

    let column_recommend_list = []
    if (!user_data.open_recommend_shorts) column_recommend_list.push('Shorts')
    if (!user_data.open_recommend_movie && !open_movie_channel) column_recommend_list.push(flag_info.free_primetime_movie)
    if (!user_data.open_recommend_popular) column_recommend_list.push(flag_info.recommend_popular)
    if (column_recommend_list.length > 0) {
        column_recommend_rule += column_recommend_list.join('|')
        if (mobile_web) mobile_web_extra_column_recommend_rule += column_recommend_list.join('|')
    }

    home_page_ytInitialData_ad_rule = [
        'title.runs[0].text......=- ~=YouTube Premium|' + flag_info.think_video,
        'richGridRenderer.masthead=-',
        'videoOwnerRenderer=- /.purchaseButton.buttonRenderer.text.simpleText~=' + flag_info.try,
        'richItemRenderer.content.adSlotRenderer..=-',
        add_movie_channel_rule,
        music_premium_ad_rule
    ]
    if (home_page_item_label_fifter_rule) home_page_ytInitialData_ad_rule = home_page_ytInitialData_ad_rule.concat(home_page_item_label_fifter_rule)

    if (!open_recommend_featured) {
        home_page_ytInitialData_ad_rule.push('brandVideoSingletonRenderer.badgeText.runs[0].text.......=- ~=' + flag_info.featured)
        home_page_ytInitialData_ad_rule.push('brandVideoShelfRenderer.badgeText.runs[0].text.......=- ~=' + flag_info.featured)
        home_page_ytInitialData_ad_rule.push('bigYoodle.statementBannerRenderer.badgeText.runs[0].text.....=- =' + flag_info.featured)
    }

    if (!user_data.open_recommend_shorts || (!user_data.open_recommend_movie && !open_movie_channel) || !user_data.open_recommend_popular) {
        home_page_ytInitialData_ad_rule.push(column_recommend_rule)
        if (mobile_web) {
            home_page_ytInitialData_ad_rule.push(mobile_web_extra_column_recommend_rule)
        }
    }
    if (watch_page_item_label_fifter_rule) watch_page_ytInitialData_ad_rule = watch_page_ytInitialData_ad_rule.concat(watch_page_item_label_fifter_rule)
}

function search_listener() {
    const search_selector = href.indexOf('https://m.youtube.com/') > -1 ? 'input.searchbox-input.title' : 'input[id="search"]'
    const search_input_node = document.querySelector(search_selector)
    if (search_input_node) {
        search_input_node.oninput = function (event) {
            if (open_config_keyword === this.value || this.value === display_error_keyword) {
                setTimeout(function () {
                    if (search_input_node.value === open_config_keyword) {
                        display_config_win()
                    }
                    if (search_input_node.value === display_error_keyword) {
                        let tips = `script ${flag_info.init} ${isinint ? flag_info.success : flag_info.failed}`
                        if (error_messages.length === 0 && isinint) tips += ' ' + flag_info.runing_normally
                        for (let key of Object.keys(inject_info)) {
                            if (!mobile_web && key === 'ytInitialPlayerResponse') continue
                            tips += `\n${key} ${flag_info.inject} ${inject_info[key] ? flag_info.success : flag_info.failed}`
                        }
                        if (error_messages.length !== 0) {
                            tips += `\n\n${flag_info.exists_error}\n-----------${flag_info.err_msg}(${flag_info.ctoc})-----------------\n${error_messages.join('\n')}\n\n${flag_info.tips}`
                        }
                        alert(tips)
                        if (error_messages.length > 0) {
                            copyToClipboard(error_messages.join('\n'))
                        }
                    }
                }, 500)
            }
        };
    }
}

function getCookie(cookieName) {
    var name = cookieName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(';');

    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i].trim();

        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text)
    var textarea = document.createElement("textarea")
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea)
}

function url_observer() {
    if (unsafeWindow.navigation) {
        unsafeWindow.navigation.addEventListener('navigate', (event) => {
            url_change(event)
        })
        return
    }
    const _historyWrap = function (type) {
        const orig = unsafeWindow.history[type];
        const e = new Event(type);
        return function () {
            const rv = orig.apply(this, arguments);
            e.arguments = arguments;
            unsafeWindow.dispatchEvent(e);
            return rv;
        };
    };
    unsafeWindow.history.pushState = _historyWrap('pushState');
    unsafeWindow.history.replaceState = _historyWrap('replaceState');
    unsafeWindow.addEventListener('replaceState', function (event) {
        url_change(event)
    })
    unsafeWindow.addEventListener('pushState', function (event) {
        url_change(event)
    });
    unsafeWindow.addEventListener('popstate', function (event) {
        url_change(event)
    })
    unsafeWindow.addEventListener('hashchange', function (event) {
        url_change(event)
    })

}

function url_change(event = null) {
    const destinationUrl = ((event || 0).destination || 0).url || '';
    if (destinationUrl.indexOf('about:blank') === 0) return;
    href = destinationUrl || location.href;
    log('网页url改变 href -> ' + href, 0);
    config_init();
}

let debugger_config_info = {
    'ytInitialPlayerResponse': debugger_ytInitialPlayerResponse,
    'ytInitialData': debugger_ytInitialData,
    'inject_info': inject_info,
    'info': [
        'home_page_ytInitialData_ad_rule',
        'watch_page_ytInitialData_ad_rule',
        'ytInitialPlayerResponse_ad_rule',
        'user_data',
        'mobile_web',
        'account_login',
        'tmp_debugger_value',
    ],
}

unsafeWindow.debugger_ = function (action = null) {
    let keys = Object.keys(debugger_config_info)
    if (!action && action !== 0) { debugger; return }
    if (action === 'ytInitialPlayerResponse') log('ytInitialPlayerResponse', debugger_ytInitialPlayerResponse, 0)
    if (action === 'ytInitialData') log('ytInitialData', debugger_ytInitialData, 0)
    if (action === 'inject_info') log('inject_info', inject_info, 0)
    if (action === 'info') {
        for (let key of debugger_config_info['info']) {
            try {
                log(key, eval(key), 0)
            } catch (error) {
                log('eval限制使用了', 0)
                return
            }
        }
    }
    if (action === 'list') {
        keys.forEach(function (key, index) {
            log(index, key, 0);
        })
    }
    if (typeof (action) === 'number') {
        if (action < keys.length) {
            unsafeWindow.debugger_(keys[action])
        } else if (action >= keys.length) {
            keys.forEach(function (key) {
                unsafeWindow.debugger_(key)
            })
        }

    }
}
function log() {
    let arguments_arr = [...arguments]
    let flag = arguments_arr.pop()
    if (flag === -1) {
        error_messages.push(arguments_arr.join(' '))
    }
    if (flag !== 0) arguments_arr.push(getCodeLocation())
    if (flag === 0 || open_debugger) orgin_log(...arguments_arr);
}

function getCodeLocation() {
    const callstack = new Error().stack.split("\n");
    callstack.shift();
    while (callstack.length && callstack[0].indexOf("chrome-extension://") !== -1) {
        callstack.shift();
    }
    if (!callstack.length) {
        return "";
    }
    return '\n' + callstack[0].trim();
}

function display_config_win() {
    const css_str = '#set_list { z-index:9999999999; display: flex; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding-top: 10px; padding-bottom: 10px; padding-left: 20px; padding-right: 20px; background-color: #fff; border: 1px solid #ccc; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); border-radius: 10px; } #set_button { margin: 0 10px; display: inline-block; padding: 5px 10px; background-color: #3498db; color: #fff; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease; } #set_button:hover { background-color: #2980b9; }'
    const style = document.createElement("style");
    style.innerText = css_str;
    document.querySelector('body').appendChild(style)
    const config_info = {
        "open_recommend_movie": flag_info.btn_recommend_movie,
        "open_recommend_shorts": flag_info.btn_recommend_shorts,
        "open_recommend_liveroom": flag_info.btn_recommend_liveroom,
        "open_recommend_popular": flag_info.btn_recommend_popular,
    }
    const container = document.createElement("div");
    container.id = "set_list"
    for (let key in config_info) {
        let label = document.createElement("label")
        let input = document.createElement("input")
        input.id = key
        input.type = 'checkbox'
        input.checked = user_data[key]
        label.appendChild(input)
        let span = document.createElement("span")
        span.textContent = config_info[key]
        span.style.userSelect = 'none'
        label.appendChild(span)
        container.appendChild(label)
    }
    let button = document.createElement("button")
    button.id = "set_button"
    button.textContent = flag_info.btn_save
    button.onclick = function () {
        for (let key in config_info) {
            user_data[key] = document.querySelector('#' + key).checked
        }
        document.querySelector('body').removeChild(container)
        GM_setValue(channel_id, user_data)
    }
    container.appendChild(button)
    document.querySelector('body').appendChild(container)
    let search_list_node = document.querySelector('body > div.gstl_50.sbdd_a')
    if (search_list_node) {
        search_list_node.style.display = 'none'
    }
}

function display_update_win() {
    function btn_click() {
        btn = this
        if (btn.id === 'go_btn') {
            location.href = script_url
        }
        document.querySelector('body').removeChild(container)
    }
    const css_str = "#update_tips_win { z-index:9999999999; display: flex; position: fixed; bottom: 20px; right: 20px; padding: 10px 20px; background-color: #fff; border: 1px solid #ccc; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); border-radius: 10px; } .btn { margin: 0 10px; display: inline-block; padding: 5px 10px; background-color: #3498db; color: #fff; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease; } .btn:hover { background-color: #2980b9; }";
    const style = document.createElement("style");
    style.innerText = css_str;
    document.querySelector('body').appendChild(style)
    const container = document.createElement("div")
    container.id = "update_tips_win"
    const span = document.createElement("span")
    span.textContent = GM_info.script.name + '有更新了！！'
    container.appendChild(span)
    const go_btn = document.createElement("button")
    go_btn.textContent = 'GO'
    go_btn.id = 'go_btn'
    go_btn.className = 'btn'
    go_btn.onclick = btn_click
    container.appendChild(go_btn)
    const no_btn = document.createElement("button")
    no_btn.textContent = 'NO'
    no_btn.className = 'btn'
    no_btn.id = 'no_btn'
    no_btn.onclick = btn_click
    container.appendChild(no_btn)
    document.querySelector('body').appendChild(container)
}

function update_old_config() {
    last_version = GM_getValue('last_version', -1)
    if (last_version === -1) {
        user_data.open_recommend_shorts = GM_getValue("open_recommend_shorts", false);
        user_data.open_recommend_movie = GM_getValue("open_recommend_movie", false);
        user_data.open_recommend_popular = GM_getValue("open_recommend_popular", false);
        user_data.open_recommend_liveroom = GM_getValue("open_recommend_liveroom", false);
    }
    if (last_version === GM_info.script.version) return
    GM_setValue("last_version", GM_info.script.version)
}

function check_update() {
    if (DISABLE_CHECK_UPDATE) return;
    let last_check_time = GM_getValue('last_check_time', 0)
    if ((new Date().getTime() - last_check_time) < 1000 * 60 * 60 * 24) return
    GM_xmlhttpRequest({
        method: 'GET',
        url: script_url,
        onload: function (response) {
            const onlineScript = response.responseText;
            // 从线上脚本中提取版本号和元数据信息
            const onlineMeta = onlineScript.match(/@version\s+([^\s]+)/i);
            const onlineVersion = onlineMeta ? onlineMeta[1] : '';
            if (onlineVersion > GM_info.script.version) {
                display_update_win()
            }
        }
    });
    GM_setValue('last_check_time', new Date().getTime())
}

function obj_process_filter(path_info, json_obj) {
    if (!account_login || ![flag_info.live, flag_info.upcoming].includes(path_info.condition_value) || user_data.channel_infos.ids.length === 0) return false
    let live_express = ['text.accessibility.accessibilityData.label........=- =' + flag_info.live,
    'metadataBadgeRenderer.label......=- =' + flag_info.live,
    'metadataBadgeRenderer.label.....=- =' + flag_info.live
    ]
    let upcoming_express = ['thumbnailOverlayTimeStatusRenderer.text.runs[0].text.........=- =' + flag_info.upcoming, 'thumbnailOverlayTimeStatusRenderer.text.simpleText.......=- =' + flag_info.upcoming]
    if (live_express.includes(path_info.express)) {
        try {
            let match = JSON.stringify(data_process.string_to_value(json_obj, path_info.deal_path)).match(/"browseId"\:"(.*?)"/)
            let id
            if (match && match.length > 1) id = match[1]
            if (!id) {
                log('id获取失败\n' + JSON.stringify(path_info), -1)
            }
            if (!user_data.channel_infos.ids.includes(id)) {
                log('过滤' + id + '的直播', 0)
            } else {
                let index = user_data.channel_infos.ids.indexOf(id)
                let name = user_data.channel_infos.names[index]
                log('不过滤' + name + '的直播', 0)
                return true
            }
        } catch (error) {
            log(error, -1)
        }
    }

    if (upcoming_express.includes(path_info.express)) {
        try {
            let match = JSON.stringify(data_process.string_to_value(json_obj, path_info.deal_path)).match(/"browseId"\:"(.*?)"/)
            let id
            if (match && match.length > 1) id = match[1]
            if (!id) {
                log('id获取失败\n' + JSON.stringify(path_info), -1)
            }
            if (!user_data.channel_infos.ids.includes(id)) {
                log('过滤' + id + '等待发布的直播', 0)
            } else {
                let index = user_data.channel_infos.ids.indexOf(id)
                let name = user_data.channel_infos.names[index]
                log('不过滤' + name + '等待发布的直播', 0)
                return true
            }
        } catch (error) {
            log(error, -1)
        }
    }
    return false
}
