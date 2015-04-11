(function (global) {
    "use strict";
    // Class ------------------------------------------------
    function Ai() {}

    // Header -----------------------------------------------
    global.Ai = Ai;
    global.Ai.thinkAI = thinkAI;
    global.Ai.canPut = canPut;
    global.Ai.getNodeList = getNodeList;
    global.Ai.putMap = putMap;



    //-------------------------------------
    var COL = 8;
    var COLXCOL = COL * COL;

    function getEffectArray(map, number, turn) {
        var list = [];
        var x = (number % COL) | 0;
        var y = (number / COL) | 0;
        var target = [];
        if (map[number] != 0) {
            return list;
        }
        for (var x_inc = -1; x_inc <= 1; x_inc++) {
            for (var y_inc = -1; y_inc <= 1; y_inc++) {
                if (x_inc === 0 && y_inc === 0) {
                    continue;
                }
                target = [];
                L: for (var _x = x + x_inc, _y = y + y_inc; _x >= 0 & _y >= 0 && _x < COL && _y < COL; _x = _x + x_inc, _y = _y + y_inc) {
                    if (map[_y * COL + _x] * turn > 0) {
                        list = list.concat(target);
                        break L;
                    } else if (map[_y * COL + _x] == 0) {
                        break L;
                    } else {
                        target.push(_y * COL + _x);
                    }
                }
            }
        }
        return list;
    }

    function canPut(map, number, turn) {
        var x = (number % COL) | 0;
        var y = (number / COL) | 0;
        var target = [];
        if (map[number] != 0) {
            return false;
        }
        for (var x_inc = -1; x_inc <= 1; x_inc++) {
            for (var y_inc = -1; y_inc <= 1; y_inc++) {
                if (x_inc === 0 && y_inc === 0) {
                    continue;
                }
                target = [];
                L: for (var _x = x + x_inc, _y = y + y_inc; _x >= 0 & _y >= 0 && _x < COL && _y < COL; _x = _x + x_inc, _y = _y + y_inc) {
                    if (map[_y * COL + _x] * turn > 0) {
                        if (target.length > 0) {
                            return true;
                        }
                        break L;
                    } else if (map[_y * COL + _x] == 0) {
                        break L;
                    } else {
                        target.push(_y * COL + _x);
                    }
                }
            }
        }
        return false;
    }

    function getNodeList(map, turn) {
        var node_list = [];
        for (var i = 0; i < COLXCOL; i++) {
            if (canPut(map, i, turn)) {
                node_list.push(i);
            }
        }
        return node_list;
    }

    function putMap(map, number, turn) {
        var effectArray = getEffectArray(map, number, turn);
        var _map = map.concat();
        _map[number] = turn;
        for (var i = 0; i < effectArray.length; i++) {
            var _number = effectArray[i] | 0;
            switch (_map[_number]) {
            case 1:
                _map[_number] = -1;
                break;
            case -1:
                _map[_number] = +1;
                break;
            }
        }
        return _map;
    }


    function evalMap(map) {
        var ev = 0;
        for (var i = 0; i < COLXCOL; i++) {
            switch (map[i]) {
            case 1:
                ev += 1;
                break;
            case -1:
                ev += -1;
                break;
            }
        }
        return ev;
    }

    function isEnd(map) {
        for (var i = 0; i < COLXCOL; i++) {
            if (map[i] != 0) {
                return false;
            }
        }
        return true;
    }

    function getWinner(map) {
        var score = 0;
        if (!isEnd(map)) {
            return 0;
        } else {
            for (var i = 0; i < COLXCOL; i++) {
                if (map[i] < 0) {
                    score += -1;
                } else if (map[i] > 0) {
                    score += 1;
                }
            }
            if (score > 0) {
                return 1;
            } else if (score < 0) {
                return -1;
            } else {
                return 0;
            }
        }
    }

    function deepThinkAllAB(map, turn, depth, a, b) {
        var best_score = turn * 999 * -1 | 0;
        var besthand;
        if (depth === 0) {
            best_score = evalMap(map) | 0;
            return [besthand, best_score];
        }
        var nodeList = getNodeList(map, turn);
        for (var i = 0; i < nodeList.length; i++) {
            var hand = nodeList[i];
            var map = putMap(map, hand, turn);
            if (isEnd(map)) {
                if (getWinner(map) === turn) {
                    return [hand, 999 * turn];
                } else {
                    if (besthand === void 0) {
                        best_score = 999 * turn * -1 | 0;
                        besthand = hand;
                    }
                    continue;
                }
            }
            var sc = deepThinkAllAB(map, turn * -1, depth - 1, b, a)[1] | 0;
            if (besthand === void 0) {
                best_score = sc;
                besthand = hand;
            }
            if (turn === 1 && sc > best_score) {
                best_score = sc;
                besthand = hand;
            } else if (turn === -1 && sc < best_score) {
                best_score = sc;
                besthand = hand;
            }
            if (turn === 1 && a < best_score || turn === -1 && a > best_score) {
                a = best_score;
            }
            if (turn === 1 && b <= best_score || turn === -1 && b >= best_score) {
                break;
            }
        }
        return [besthand, best_score];
    }

    function thinkAI(map, turn_player, depth) {
        return deepThinkAllAB(map, turn_player, depth, 999 * turn_player * -1, 999 * turn_player);
    }
})((this || 0).self || global);