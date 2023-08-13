"use strict";
const schema22 = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Generated schema for Root",
    "type": "object",
    "properties": {
        "version": {
            "type": "number"
        },
        "code": {
            "type": "string"
        },
        "cards": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "count": {
                        "type": "number"
                    },
                    "front": {
                        "type": "object",
                        "properties": {
                            "Name": {
                                "type": "string"
                            },
                            "ID": {
                                "type": "string"
                            },
                            "SourceID": {
                                "type": "string"
                            },
                            "Exp": {
                                "type": "string"
                            },
                            "Width": {
                                "type": "number"
                            },
                            "Height": {
                                "type": "number"
                            }
                        },
                        "required": ["Name", "ID", "SourceID", "Exp", "Width", "Height"]
                    },
                    "back": {
                        "type": "object",
                        "properties": {
                            "Name": {
                                "type": "string"
                            },
                            "ID": {
                                "type": "string"
                            },
                            "SourceID": {
                                "type": "string"
                            },
                            "Exp": {
                                "type": "string"
                            },
                            "Width": {
                                "type": "number"
                            },
                            "Height": {
                                "type": "number"
                            }
                        },
                        "required": ["Name", "ID", "SourceID", "Exp", "Width", "Height"]
                    }
                },
                "required": ["count"]
            }
        }
    },
    "required": ["version", "code", "cards"]
};

function validate20(data, {
    instancePath = "",
    parentData,
    parentDataProperty,
    rootData = data
} = {}) {
    let vErrors = null;
    let errors = 0;
    if (errors === 0) {
        if (data && typeof data == "object" && !Array.isArray(data)) {
            let missing0;
            if ((((data.version === undefined) && (missing0 = "version")) || ((data.code === undefined) && (missing0 = "code"))) || ((data.cards === undefined) && (missing0 = "cards"))) {
                validate20.errors = [{
                    instancePath,
                    schemaPath: "#/required",
                    keyword: "required",
                    params: {
                        missingProperty: missing0
                    },
                    message: "must have required property '" + missing0 + "'"
                }];
                return false;
            } else {
                if (data.version !== undefined) {
                    let data0 = data.version;
                    const _errs1 = errors;
                    if (!((typeof data0 == "number") && (isFinite(data0)))) {
                        validate20.errors = [{
                            instancePath: instancePath + "/version",
                            schemaPath: "#/properties/version/type",
                            keyword: "type",
                            params: {
                                type: "number"
                            },
                            message: "must be number"
                        }];
                        return false;
                    }
                    var valid0 = _errs1 === errors;
                } else {
                    var valid0 = true;
                }
                if (valid0) {
                    if (data.code !== undefined) {
                        const _errs3 = errors;
                        if (typeof data.code !== "string") {
                            validate20.errors = [{
                                instancePath: instancePath + "/code",
                                schemaPath: "#/properties/code/type",
                                keyword: "type",
                                params: {
                                    type: "string"
                                },
                                message: "must be string"
                            }];
                            return false;
                        }
                        var valid0 = _errs3 === errors;
                    } else {
                        var valid0 = true;
                    }
                    if (valid0) {
                        if (data.cards !== undefined) {
                            let data2 = data.cards;
                            const _errs5 = errors;
                            if (errors === _errs5) {
                                if (Array.isArray(data2)) {
                                    var valid1 = true;
                                    const len0 = data2.length;
                                    for (let i0 = 0; i0 < len0; i0++) {
                                        let data3 = data2[i0];
                                        const _errs7 = errors;
                                        if (errors === _errs7) {
                                            if (data3 && typeof data3 == "object" && !Array.isArray(data3)) {
                                                let missing1;
                                                if ((data3.count === undefined) && (missing1 = "count")) {
                                                    validate20.errors = [{
                                                        instancePath: instancePath + "/cards/" + i0,
                                                        schemaPath: "#/properties/cards/items/required",
                                                        keyword: "required",
                                                        params: {
                                                            missingProperty: missing1
                                                        },
                                                        message: "must have required property '" + missing1 + "'"
                                                    }];
                                                    return false;
                                                } else {
                                                    if (data3.count !== undefined) {
                                                        let data4 = data3.count;
                                                        const _errs9 = errors;
                                                        if (!((typeof data4 == "number") && (isFinite(data4)))) {
                                                            validate20.errors = [{
                                                                instancePath: instancePath + "/cards/" + i0 + "/count",
                                                                schemaPath: "#/properties/cards/items/properties/count/type",
                                                                keyword: "type",
                                                                params: {
                                                                    type: "number"
                                                                },
                                                                message: "must be number"
                                                            }];
                                                            return false;
                                                        }
                                                        var valid2 = _errs9 === errors;
                                                    } else {
                                                        var valid2 = true;
                                                    }
                                                    if (valid2) {
                                                        if (data3.front !== undefined) {
                                                            let data5 = data3.front;
                                                            const _errs11 = errors;
                                                            if (errors === _errs11) {
                                                                if (data5 && typeof data5 == "object" && !Array.isArray(data5)) {
                                                                    let missing2;
                                                                    if (((((((data5.Name === undefined) && (missing2 = "Name")) || ((data5.ID === undefined) && (missing2 = "ID"))) || ((data5.SourceID === undefined) && (missing2 = "SourceID"))) || ((data5.Exp === undefined) && (missing2 = "Exp"))) || ((data5.Width === undefined) && (missing2 = "Width"))) || ((data5.Height === undefined) && (missing2 = "Height"))) {
                                                                        validate20.errors = [{
                                                                            instancePath: instancePath + "/cards/" + i0 + "/front",
                                                                            schemaPath: "#/properties/cards/items/properties/front/required",
                                                                            keyword: "required",
                                                                            params: {
                                                                                missingProperty: missing2
                                                                            },
                                                                            message: "must have required property '" + missing2 + "'"
                                                                        }];
                                                                        return false;
                                                                    } else {
                                                                        if (data5.Name !== undefined) {
                                                                            const _errs13 = errors;
                                                                            if (typeof data5.Name !== "string") {
                                                                                validate20.errors = [{
                                                                                    instancePath: instancePath + "/cards/" + i0 + "/front/Name",
                                                                                    schemaPath: "#/properties/cards/items/properties/front/properties/Name/type",
                                                                                    keyword: "type",
                                                                                    params: {
                                                                                        type: "string"
                                                                                    },
                                                                                    message: "must be string"
                                                                                }];
                                                                                return false;
                                                                            }
                                                                            var valid3 = _errs13 === errors;
                                                                        } else {
                                                                            var valid3 = true;
                                                                        }
                                                                        if (valid3) {
                                                                            if (data5.ID !== undefined) {
                                                                                const _errs15 = errors;
                                                                                if (typeof data5.ID !== "string") {
                                                                                    validate20.errors = [{
                                                                                        instancePath: instancePath + "/cards/" + i0 + "/front/ID",
                                                                                        schemaPath: "#/properties/cards/items/properties/front/properties/ID/type",
                                                                                        keyword: "type",
                                                                                        params: {
                                                                                            type: "string"
                                                                                        },
                                                                                        message: "must be string"
                                                                                    }];
                                                                                    return false;
                                                                                }
                                                                                var valid3 = _errs15 === errors;
                                                                            } else {
                                                                                var valid3 = true;
                                                                            }
                                                                            if (valid3) {
                                                                                if (data5.SourceID !== undefined) {
                                                                                    const _errs17 = errors;
                                                                                    if (typeof data5.SourceID !== "string") {
                                                                                        validate20.errors = [{
                                                                                            instancePath: instancePath + "/cards/" + i0 + "/front/SourceID",
                                                                                            schemaPath: "#/properties/cards/items/properties/front/properties/SourceID/type",
                                                                                            keyword: "type",
                                                                                            params: {
                                                                                                type: "string"
                                                                                            },
                                                                                            message: "must be string"
                                                                                        }];
                                                                                        return false;
                                                                                    }
                                                                                    var valid3 = _errs17 === errors;
                                                                                } else {
                                                                                    var valid3 = true;
                                                                                }
                                                                                if (valid3) {
                                                                                    if (data5.Exp !== undefined) {
                                                                                        const _errs19 = errors;
                                                                                        if (typeof data5.Exp !== "string") {
                                                                                            validate20.errors = [{
                                                                                                instancePath: instancePath + "/cards/" + i0 + "/front/Exp",
                                                                                                schemaPath: "#/properties/cards/items/properties/front/properties/Exp/type",
                                                                                                keyword: "type",
                                                                                                params: {
                                                                                                    type: "string"
                                                                                                },
                                                                                                message: "must be string"
                                                                                            }];
                                                                                            return false;
                                                                                        }
                                                                                        var valid3 = _errs19 === errors;
                                                                                    } else {
                                                                                        var valid3 = true;
                                                                                    }
                                                                                    if (valid3) {
                                                                                        if (data5.Width !== undefined) {
                                                                                            let data10 = data5.Width;
                                                                                            const _errs21 = errors;
                                                                                            if (!((typeof data10 == "number") && (isFinite(data10)))) {
                                                                                                validate20.errors = [{
                                                                                                    instancePath: instancePath + "/cards/" + i0 + "/front/Width",
                                                                                                    schemaPath: "#/properties/cards/items/properties/front/properties/Width/type",
                                                                                                    keyword: "type",
                                                                                                    params: {
                                                                                                        type: "number"
                                                                                                    },
                                                                                                    message: "must be number"
                                                                                                }];
                                                                                                return false;
                                                                                            }
                                                                                            var valid3 = _errs21 === errors;
                                                                                        } else {
                                                                                            var valid3 = true;
                                                                                        }
                                                                                        if (valid3) {
                                                                                            if (data5.Height !== undefined) {
                                                                                                let data11 = data5.Height;
                                                                                                const _errs23 = errors;
                                                                                                if (!((typeof data11 == "number") && (isFinite(data11)))) {
                                                                                                    validate20.errors = [{
                                                                                                        instancePath: instancePath + "/cards/" + i0 + "/front/Height",
                                                                                                        schemaPath: "#/properties/cards/items/properties/front/properties/Height/type",
                                                                                                        keyword: "type",
                                                                                                        params: {
                                                                                                            type: "number"
                                                                                                        },
                                                                                                        message: "must be number"
                                                                                                    }];
                                                                                                    return false;
                                                                                                }
                                                                                                var valid3 = _errs23 === errors;
                                                                                            } else {
                                                                                                var valid3 = true;
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                } else {
                                                                    validate20.errors = [{
                                                                        instancePath: instancePath + "/cards/" + i0 + "/front",
                                                                        schemaPath: "#/properties/cards/items/properties/front/type",
                                                                        keyword: "type",
                                                                        params: {
                                                                            type: "object"
                                                                        },
                                                                        message: "must be object"
                                                                    }];
                                                                    return false;
                                                                }
                                                            }
                                                            var valid2 = _errs11 === errors;
                                                        } else {
                                                            var valid2 = true;
                                                        }
                                                        if (valid2) {
                                                            if (data3.back !== undefined) {
                                                                let data12 = data3.back;
                                                                const _errs25 = errors;
                                                                if (errors === _errs25) {
                                                                    if (data12 && typeof data12 == "object" && !Array.isArray(data12)) {
                                                                        let missing3;
                                                                        if (((((((data12.Name === undefined) && (missing3 = "Name")) || ((data12.ID === undefined) && (missing3 = "ID"))) || ((data12.SourceID === undefined) && (missing3 = "SourceID"))) || ((data12.Exp === undefined) && (missing3 = "Exp"))) || ((data12.Width === undefined) && (missing3 = "Width"))) || ((data12.Height === undefined) && (missing3 = "Height"))) {
                                                                            validate20.errors = [{
                                                                                instancePath: instancePath + "/cards/" + i0 + "/back",
                                                                                schemaPath: "#/properties/cards/items/properties/back/required",
                                                                                keyword: "required",
                                                                                params: {
                                                                                    missingProperty: missing3
                                                                                },
                                                                                message: "must have required property '" + missing3 + "'"
                                                                            }];
                                                                            return false;
                                                                        } else {
                                                                            if (data12.Name !== undefined) {
                                                                                const _errs27 = errors;
                                                                                if (typeof data12.Name !== "string") {
                                                                                    validate20.errors = [{
                                                                                        instancePath: instancePath + "/cards/" + i0 + "/back/Name",
                                                                                        schemaPath: "#/properties/cards/items/properties/back/properties/Name/type",
                                                                                        keyword: "type",
                                                                                        params: {
                                                                                            type: "string"
                                                                                        },
                                                                                        message: "must be string"
                                                                                    }];
                                                                                    return false;
                                                                                }
                                                                                var valid4 = _errs27 === errors;
                                                                            } else {
                                                                                var valid4 = true;
                                                                            }
                                                                            if (valid4) {
                                                                                if (data12.ID !== undefined) {
                                                                                    const _errs29 = errors;
                                                                                    if (typeof data12.ID !== "string") {
                                                                                        validate20.errors = [{
                                                                                            instancePath: instancePath + "/cards/" + i0 + "/back/ID",
                                                                                            schemaPath: "#/properties/cards/items/properties/back/properties/ID/type",
                                                                                            keyword: "type",
                                                                                            params: {
                                                                                                type: "string"
                                                                                            },
                                                                                            message: "must be string"
                                                                                        }];
                                                                                        return false;
                                                                                    }
                                                                                    var valid4 = _errs29 === errors;
                                                                                } else {
                                                                                    var valid4 = true;
                                                                                }
                                                                                if (valid4) {
                                                                                    if (data12.SourceID !== undefined) {
                                                                                        const _errs31 = errors;
                                                                                        if (typeof data12.SourceID !== "string") {
                                                                                            validate20.errors = [{
                                                                                                instancePath: instancePath + "/cards/" + i0 + "/back/SourceID",
                                                                                                schemaPath: "#/properties/cards/items/properties/back/properties/SourceID/type",
                                                                                                keyword: "type",
                                                                                                params: {
                                                                                                    type: "string"
                                                                                                },
                                                                                                message: "must be string"
                                                                                            }];
                                                                                            return false;
                                                                                        }
                                                                                        var valid4 = _errs31 === errors;
                                                                                    } else {
                                                                                        var valid4 = true;
                                                                                    }
                                                                                    if (valid4) {
                                                                                        if (data12.Exp !== undefined) {
                                                                                            const _errs33 = errors;
                                                                                            if (typeof data12.Exp !== "string") {
                                                                                                validate20.errors = [{
                                                                                                    instancePath: instancePath + "/cards/" + i0 + "/back/Exp",
                                                                                                    schemaPath: "#/properties/cards/items/properties/back/properties/Exp/type",
                                                                                                    keyword: "type",
                                                                                                    params: {
                                                                                                        type: "string"
                                                                                                    },
                                                                                                    message: "must be string"
                                                                                                }];
                                                                                                return false;
                                                                                            }
                                                                                            var valid4 = _errs33 === errors;
                                                                                        } else {
                                                                                            var valid4 = true;
                                                                                        }
                                                                                        if (valid4) {
                                                                                            if (data12.Width !== undefined) {
                                                                                                let data17 = data12.Width;
                                                                                                const _errs35 = errors;
                                                                                                if (!((typeof data17 == "number") && (isFinite(data17)))) {
                                                                                                    validate20.errors = [{
                                                                                                        instancePath: instancePath + "/cards/" + i0 + "/back/Width",
                                                                                                        schemaPath: "#/properties/cards/items/properties/back/properties/Width/type",
                                                                                                        keyword: "type",
                                                                                                        params: {
                                                                                                            type: "number"
                                                                                                        },
                                                                                                        message: "must be number"
                                                                                                    }];
                                                                                                    return false;
                                                                                                }
                                                                                                var valid4 = _errs35 === errors;
                                                                                            } else {
                                                                                                var valid4 = true;
                                                                                            }
                                                                                            if (valid4) {
                                                                                                if (data12.Height !== undefined) {
                                                                                                    let data18 = data12.Height;
                                                                                                    const _errs37 = errors;
                                                                                                    if (!((typeof data18 == "number") && (isFinite(data18)))) {
                                                                                                        validate20.errors = [{
                                                                                                            instancePath: instancePath + "/cards/" + i0 + "/back/Height",
                                                                                                            schemaPath: "#/properties/cards/items/properties/back/properties/Height/type",
                                                                                                            keyword: "type",
                                                                                                            params: {
                                                                                                                type: "number"
                                                                                                            },
                                                                                                            message: "must be number"
                                                                                                        }];
                                                                                                        return false;
                                                                                                    }
                                                                                                    var valid4 = _errs37 === errors;
                                                                                                } else {
                                                                                                    var valid4 = true;
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    } else {
                                                                        validate20.errors = [{
                                                                            instancePath: instancePath + "/cards/" + i0 + "/back",
                                                                            schemaPath: "#/properties/cards/items/properties/back/type",
                                                                            keyword: "type",
                                                                            params: {
                                                                                type: "object"
                                                                            },
                                                                            message: "must be object"
                                                                        }];
                                                                        return false;
                                                                    }
                                                                }
                                                                var valid2 = _errs25 === errors;
                                                            } else {
                                                                var valid2 = true;
                                                            }
                                                        }
                                                    }
                                                }
                                            } else {
                                                validate20.errors = [{
                                                    instancePath: instancePath + "/cards/" + i0,
                                                    schemaPath: "#/properties/cards/items/type",
                                                    keyword: "type",
                                                    params: {
                                                        type: "object"
                                                    },
                                                    message: "must be object"
                                                }];
                                                return false;
                                            }
                                        }
                                        var valid1 = _errs7 === errors;
                                        if (!valid1) {
                                            break;
                                        }
                                    }
                                } else {
                                    validate20.errors = [{
                                        instancePath: instancePath + "/cards",
                                        schemaPath: "#/properties/cards/type",
                                        keyword: "type",
                                        params: {
                                            type: "array"
                                        },
                                        message: "must be array"
                                    }];
                                    return false;
                                }
                            }
                            var valid0 = _errs5 === errors;
                        } else {
                            var valid0 = true;
                        }
                    }
                }
            }
        } else {
            validate20.errors = [{
                instancePath,
                schemaPath: "#/type",
                keyword: "type",
                params: {
                    type: "object"
                },
                message: "must be object"
            }];
            return false;
        }
    }
    validate20.errors = vErrors;
    return errors === 0;
}
const schema23 = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Generated schema for Root",
    "type": "object",
    "properties": {
        "version": {
            "type": "number"
        },
        "code": {
            "type": "string"
        },
        "parts": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    },
                    "cards": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "count": {
                                    "type": "number"
                                },
                                "front": {
                                    "type": "object",
                                    "properties": {
                                        "Name": {
                                            "type": "string"
                                        },
                                        "ID": {
                                            "type": "string"
                                        },
                                        "SourceID": {
                                            "type": "string"
                                        },
                                        "Exp": {
                                            "type": "string"
                                        },
                                        "Width": {
                                            "type": "number"
                                        },
                                        "Height": {
                                            "type": "number"
                                        }
                                    },
                                    "required": ["Name", "ID", "SourceID", "Exp", "Width", "Height"]
                                },
                                "back": {
                                    "type": "object",
                                    "properties": {
                                        "Name": {
                                            "type": "string"
                                        },
                                        "ID": {
                                            "type": "string"
                                        },
                                        "SourceID": {
                                            "type": "string"
                                        },
                                        "Exp": {
                                            "type": "string"
                                        },
                                        "Width": {
                                            "type": "number"
                                        },
                                        "Height": {
                                            "type": "number"
                                        }
                                    },
                                    "required": ["Name", "ID", "SourceID", "Exp", "Width", "Height"]
                                }
                            },
                            "required": ["count"]
                        }
                    }
                },
                "required": ["name", "cards"]
            }
        }
    },
    "required": ["version", "code", "parts"]
};

function validate21(data, {
    instancePath = "",
    parentData,
    parentDataProperty,
    rootData = data
} = {}) {
    let vErrors = null;
    let errors = 0;
    if (errors === 0) {
        if (data && typeof data == "object" && !Array.isArray(data)) {
            let missing0;
            if ((((data.version === undefined) && (missing0 = "version")) || ((data.code === undefined) && (missing0 = "code"))) || ((data.parts === undefined) && (missing0 = "parts"))) {
                validate21.errors = [{
                    instancePath,
                    schemaPath: "#/required",
                    keyword: "required",
                    params: {
                        missingProperty: missing0
                    },
                    message: "must have required property '" + missing0 + "'"
                }];
                return false;
            } else {
                if (data.version !== undefined) {
                    let data0 = data.version;
                    const _errs1 = errors;
                    if (!((typeof data0 == "number") && (isFinite(data0)))) {
                        validate21.errors = [{
                            instancePath: instancePath + "/version",
                            schemaPath: "#/properties/version/type",
                            keyword: "type",
                            params: {
                                type: "number"
                            },
                            message: "must be number"
                        }];
                        return false;
                    }
                    var valid0 = _errs1 === errors;
                } else {
                    var valid0 = true;
                }
                if (valid0) {
                    if (data.code !== undefined) {
                        const _errs3 = errors;
                        if (typeof data.code !== "string") {
                            validate21.errors = [{
                                instancePath: instancePath + "/code",
                                schemaPath: "#/properties/code/type",
                                keyword: "type",
                                params: {
                                    type: "string"
                                },
                                message: "must be string"
                            }];
                            return false;
                        }
                        var valid0 = _errs3 === errors;
                    } else {
                        var valid0 = true;
                    }
                    if (valid0) {
                        if (data.parts !== undefined) {
                            let data2 = data.parts;
                            const _errs5 = errors;
                            if (errors === _errs5) {
                                if (Array.isArray(data2)) {
                                    var valid1 = true;
                                    const len0 = data2.length;
                                    for (let i0 = 0; i0 < len0; i0++) {
                                        let data3 = data2[i0];
                                        const _errs7 = errors;
                                        if (errors === _errs7) {
                                            if (data3 && typeof data3 == "object" && !Array.isArray(data3)) {
                                                let missing1;
                                                if (((data3.name === undefined) && (missing1 = "name")) || ((data3.cards === undefined) && (missing1 = "cards"))) {
                                                    validate21.errors = [{
                                                        instancePath: instancePath + "/parts/" + i0,
                                                        schemaPath: "#/properties/parts/items/required",
                                                        keyword: "required",
                                                        params: {
                                                            missingProperty: missing1
                                                        },
                                                        message: "must have required property '" + missing1 + "'"
                                                    }];
                                                    return false;
                                                } else {
                                                    if (data3.name !== undefined) {
                                                        const _errs9 = errors;
                                                        if (typeof data3.name !== "string") {
                                                            validate21.errors = [{
                                                                instancePath: instancePath + "/parts/" + i0 + "/name",
                                                                schemaPath: "#/properties/parts/items/properties/name/type",
                                                                keyword: "type",
                                                                params: {
                                                                    type: "string"
                                                                },
                                                                message: "must be string"
                                                            }];
                                                            return false;
                                                        }
                                                        var valid2 = _errs9 === errors;
                                                    } else {
                                                        var valid2 = true;
                                                    }
                                                    if (valid2) {
                                                        if (data3.cards !== undefined) {
                                                            let data5 = data3.cards;
                                                            const _errs11 = errors;
                                                            if (errors === _errs11) {
                                                                if (Array.isArray(data5)) {
                                                                    var valid3 = true;
                                                                    const len1 = data5.length;
                                                                    for (let i1 = 0; i1 < len1; i1++) {
                                                                        let data6 = data5[i1];
                                                                        const _errs13 = errors;
                                                                        if (errors === _errs13) {
                                                                            if (data6 && typeof data6 == "object" && !Array.isArray(data6)) {
                                                                                let missing2;
                                                                                if ((data6.count === undefined) && (missing2 = "count")) {
                                                                                    validate21.errors = [{
                                                                                        instancePath: instancePath + "/parts/" + i0 + "/cards/" + i1,
                                                                                        schemaPath: "#/properties/parts/items/properties/cards/items/required",
                                                                                        keyword: "required",
                                                                                        params: {
                                                                                            missingProperty: missing2
                                                                                        },
                                                                                        message: "must have required property '" + missing2 + "'"
                                                                                    }];
                                                                                    return false;
                                                                                } else {
                                                                                    if (data6.count !== undefined) {
                                                                                        let data7 = data6.count;
                                                                                        const _errs15 = errors;
                                                                                        if (!((typeof data7 == "number") && (isFinite(data7)))) {
                                                                                            validate21.errors = [{
                                                                                                instancePath: instancePath + "/parts/" + i0 + "/cards/" + i1 + "/count",
                                                                                                schemaPath: "#/properties/parts/items/properties/cards/items/properties/count/type",
                                                                                                keyword: "type",
                                                                                                params: {
                                                                                                    type: "number"
                                                                                                },
                                                                                                message: "must be number"
                                                                                            }];
                                                                                            return false;
                                                                                        }
                                                                                        var valid4 = _errs15 === errors;
                                                                                    } else {
                                                                                        var valid4 = true;
                                                                                    }
                                                                                    if (valid4) {
                                                                                        if (data6.front !== undefined) {
                                                                                            let data8 = data6.front;
                                                                                            const _errs17 = errors;
                                                                                            if (errors === _errs17) {
                                                                                                if (data8 && typeof data8 == "object" && !Array.isArray(data8)) {
                                                                                                    let missing3;
                                                                                                    if (((((((data8.Name === undefined) && (missing3 = "Name")) || ((data8.ID === undefined) && (missing3 = "ID"))) || ((data8.SourceID === undefined) && (missing3 = "SourceID"))) || ((data8.Exp === undefined) && (missing3 = "Exp"))) || ((data8.Width === undefined) && (missing3 = "Width"))) || ((data8.Height === undefined) && (missing3 = "Height"))) {
                                                                                                        validate21.errors = [{
                                                                                                            instancePath: instancePath + "/parts/" + i0 + "/cards/" + i1 + "/front",
                                                                                                            schemaPath: "#/properties/parts/items/properties/cards/items/properties/front/required",
                                                                                                            keyword: "required",
                                                                                                            params: {
                                                                                                                missingProperty: missing3
                                                                                                            },
                                                                                                            message: "must have required property '" + missing3 + "'"
                                                                                                        }];
                                                                                                        return false;
                                                                                                    } else {
                                                                                                        if (data8.Name !== undefined) {
                                                                                                            const _errs19 = errors;
                                                                                                            if (typeof data8.Name !== "string") {
                                                                                                                validate21.errors = [{
                                                                                                                    instancePath: instancePath + "/parts/" + i0 + "/cards/" + i1 + "/front/Name",
                                                                                                                    schemaPath: "#/properties/parts/items/properties/cards/items/properties/front/properties/Name/type",
                                                                                                                    keyword: "type",
                                                                                                                    params: {
                                                                                                                        type: "string"
                                                                                                                    },
                                                                                                                    message: "must be string"
                                                                                                                }];
                                                                                                                return false;
                                                                                                            }
                                                                                                            var valid5 = _errs19 === errors;
                                                                                                        } else {
                                                                                                            var valid5 = true;
                                                                                                        }
                                                                                                        if (valid5) {
                                                                                                            if (data8.ID !== undefined) {
                                                                                                                const _errs21 = errors;
                                                                                                                if (typeof data8.ID !== "string") {
                                                                                                                    validate21.errors = [{
                                                                                                                        instancePath: instancePath + "/parts/" + i0 + "/cards/" + i1 + "/front/ID",
                                                                                                                        schemaPath: "#/properties/parts/items/properties/cards/items/properties/front/properties/ID/type",
                                                                                                                        keyword: "type",
                                                                                                                        params: {
                                                                                                                            type: "string"
                                                                                                                        },
                                                                                                                        message: "must be string"
                                                                                                                    }];
                                                                                                                    return false;
                                                                                                                }
                                                                                                                var valid5 = _errs21 === errors;
                                                                                                            } else {
                                                                                                                var valid5 = true;
                                                                                                            }
                                                                                                            if (valid5) {
                                                                                                                if (data8.SourceID !== undefined) {
                                                                                                                    const _errs23 = errors;
                                                                                                                    if (typeof data8.SourceID !== "string") {
                                                                                                                        validate21.errors = [{
                                                                                                                            instancePath: instancePath + "/parts/" + i0 + "/cards/" + i1 + "/front/SourceID",
                                                                                                                            schemaPath: "#/properties/parts/items/properties/cards/items/properties/front/properties/SourceID/type",
                                                                                                                            keyword: "type",
                                                                                                                            params: {
                                                                                                                                type: "string"
                                                                                                                            },
                                                                                                                            message: "must be string"
                                                                                                                        }];
                                                                                                                        return false;
                                                                                                                    }
                                                                                                                    var valid5 = _errs23 === errors;
                                                                                                                } else {
                                                                                                                    var valid5 = true;
                                                                                                                }
                                                                                                                if (valid5) {
                                                                                                                    if (data8.Exp !== undefined) {
                                                                                                                        const _errs25 = errors;
                                                                                                                        if (typeof data8.Exp !== "string") {
                                                                                                                            validate21.errors = [{
                                                                                                                                instancePath: instancePath + "/parts/" + i0 + "/cards/" + i1 + "/front/Exp",
                                                                                                                                schemaPath: "#/properties/parts/items/properties/cards/items/properties/front/properties/Exp/type",
                                                                                                                                keyword: "type",
                                                                                                                                params: {
                                                                                                                                    type: "string"
                                                                                                                                },
                                                                                                                                message: "must be string"
                                                                                                                            }];
                                                                                                                            return false;
                                                                                                                        }
                                                                                                                        var valid5 = _errs25 === errors;
                                                                                                                    } else {
                                                                                                                        var valid5 = true;
                                                                                                                    }
                                                                                                                    if (valid5) {
                                                                                                                        if (data8.Width !== undefined) {
                                                                                                                            let data13 = data8.Width;
                                                                                                                            const _errs27 = errors;
                                                                                                                            if (!((typeof data13 == "number") && (isFinite(data13)))) {
                                                                                                                                validate21.errors = [{
                                                                                                                                    instancePath: instancePath + "/parts/" + i0 + "/cards/" + i1 + "/front/Width",
                                                                                                                                    schemaPath: "#/properties/parts/items/properties/cards/items/properties/front/properties/Width/type",
                                                                                                                                    keyword: "type",
                                                                                                                                    params: {
                                                                                                                                        type: "number"
                                                                                                                                    },
                                                                                                                                    message: "must be number"
                                                                                                                                }];
                                                                                                                                return false;
                                                                                                                            }
                                                                                                                            var valid5 = _errs27 === errors;
                                                                                                                        } else {
                                                                                                                            var valid5 = true;
                                                                                                                        }
                                                                                                                        if (valid5) {
                                                                                                                            if (data8.Height !== undefined) {
                                                                                                                                let data14 = data8.Height;
                                                                                                                                const _errs29 = errors;
                                                                                                                                if (!((typeof data14 == "number") && (isFinite(data14)))) {
                                                                                                                                    validate21.errors = [{
                                                                                                                                        instancePath: instancePath + "/parts/" + i0 + "/cards/" + i1 + "/front/Height",
                                                                                                                                        schemaPath: "#/properties/parts/items/properties/cards/items/properties/front/properties/Height/type",
                                                                                                                                        keyword: "type",
                                                                                                                                        params: {
                                                                                                                                            type: "number"
                                                                                                                                        },
                                                                                                                                        message: "must be number"
                                                                                                                                    }];
                                                                                                                                    return false;
                                                                                                                                }
                                                                                                                                var valid5 = _errs29 === errors;
                                                                                                                            } else {
                                                                                                                                var valid5 = true;
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                } else {
                                                                                                    validate21.errors = [{
                                                                                                        instancePath: instancePath + "/parts/" + i0 + "/cards/" + i1 + "/front",
                                                                                                        schemaPath: "#/properties/parts/items/properties/cards/items/properties/front/type",
                                                                                                        keyword: "type",
                                                                                                        params: {
                                                                                                            type: "object"
                                                                                                        },
                                                                                                        message: "must be object"
                                                                                                    }];
                                                                                                    return false;
                                                                                                }
                                                                                            }
                                                                                            var valid4 = _errs17 === errors;
                                                                                        } else {
                                                                                            var valid4 = true;
                                                                                        }
                                                                                        if (valid4) {
                                                                                            if (data6.back !== undefined) {
                                                                                                let data15 = data6.back;
                                                                                                const _errs31 = errors;
                                                                                                if (errors === _errs31) {
                                                                                                    if (data15 && typeof data15 == "object" && !Array.isArray(data15)) {
                                                                                                        let missing4;
                                                                                                        if (((((((data15.Name === undefined) && (missing4 = "Name")) || ((data15.ID === undefined) && (missing4 = "ID"))) || ((data15.SourceID === undefined) && (missing4 = "SourceID"))) || ((data15.Exp === undefined) && (missing4 = "Exp"))) || ((data15.Width === undefined) && (missing4 = "Width"))) || ((data15.Height === undefined) && (missing4 = "Height"))) {
                                                                                                            validate21.errors = [{
                                                                                                                instancePath: instancePath + "/parts/" + i0 + "/cards/" + i1 + "/back",
                                                                                                                schemaPath: "#/properties/parts/items/properties/cards/items/properties/back/required",
                                                                                                                keyword: "required",
                                                                                                                params: {
                                                                                                                    missingProperty: missing4
                                                                                                                },
                                                                                                                message: "must have required property '" + missing4 + "'"
                                                                                                            }];
                                                                                                            return false;
                                                                                                        } else {
                                                                                                            if (data15.Name !== undefined) {
                                                                                                                const _errs33 = errors;
                                                                                                                if (typeof data15.Name !== "string") {
                                                                                                                    validate21.errors = [{
                                                                                                                        instancePath: instancePath + "/parts/" + i0 + "/cards/" + i1 + "/back/Name",
                                                                                                                        schemaPath: "#/properties/parts/items/properties/cards/items/properties/back/properties/Name/type",
                                                                                                                        keyword: "type",
                                                                                                                        params: {
                                                                                                                            type: "string"
                                                                                                                        },
                                                                                                                        message: "must be string"
                                                                                                                    }];
                                                                                                                    return false;
                                                                                                                }
                                                                                                                var valid6 = _errs33 === errors;
                                                                                                            } else {
                                                                                                                var valid6 = true;
                                                                                                            }
                                                                                                            if (valid6) {
                                                                                                                if (data15.ID !== undefined) {
                                                                                                                    const _errs35 = errors;
                                                                                                                    if (typeof data15.ID !== "string") {
                                                                                                                        validate21.errors = [{
                                                                                                                            instancePath: instancePath + "/parts/" + i0 + "/cards/" + i1 + "/back/ID",
                                                                                                                            schemaPath: "#/properties/parts/items/properties/cards/items/properties/back/properties/ID/type",
                                                                                                                            keyword: "type",
                                                                                                                            params: {
                                                                                                                                type: "string"
                                                                                                                            },
                                                                                                                            message: "must be string"
                                                                                                                        }];
                                                                                                                        return false;
                                                                                                                    }
                                                                                                                    var valid6 = _errs35 === errors;
                                                                                                                } else {
                                                                                                                    var valid6 = true;
                                                                                                                }
                                                                                                                if (valid6) {
                                                                                                                    if (data15.SourceID !== undefined) {
                                                                                                                        const _errs37 = errors;
                                                                                                                        if (typeof data15.SourceID !== "string") {
                                                                                                                            validate21.errors = [{
                                                                                                                                instancePath: instancePath + "/parts/" + i0 + "/cards/" + i1 + "/back/SourceID",
                                                                                                                                schemaPath: "#/properties/parts/items/properties/cards/items/properties/back/properties/SourceID/type",
                                                                                                                                keyword: "type",
                                                                                                                                params: {
                                                                                                                                    type: "string"
                                                                                                                                },
                                                                                                                                message: "must be string"
                                                                                                                            }];
                                                                                                                            return false;
                                                                                                                        }
                                                                                                                        var valid6 = _errs37 === errors;
                                                                                                                    } else {
                                                                                                                        var valid6 = true;
                                                                                                                    }
                                                                                                                    if (valid6) {
                                                                                                                        if (data15.Exp !== undefined) {
                                                                                                                            const _errs39 = errors;
                                                                                                                            if (typeof data15.Exp !== "string") {
                                                                                                                                validate21.errors = [{
                                                                                                                                    instancePath: instancePath + "/parts/" + i0 + "/cards/" + i1 + "/back/Exp",
                                                                                                                                    schemaPath: "#/properties/parts/items/properties/cards/items/properties/back/properties/Exp/type",
                                                                                                                                    keyword: "type",
                                                                                                                                    params: {
                                                                                                                                        type: "string"
                                                                                                                                    },
                                                                                                                                    message: "must be string"
                                                                                                                                }];
                                                                                                                                return false;
                                                                                                                            }
                                                                                                                            var valid6 = _errs39 === errors;
                                                                                                                        } else {
                                                                                                                            var valid6 = true;
                                                                                                                        }
                                                                                                                        if (valid6) {
                                                                                                                            if (data15.Width !== undefined) {
                                                                                                                                let data20 = data15.Width;
                                                                                                                                const _errs41 = errors;
                                                                                                                                if (!((typeof data20 == "number") && (isFinite(data20)))) {
                                                                                                                                    validate21.errors = [{
                                                                                                                                        instancePath: instancePath + "/parts/" + i0 + "/cards/" + i1 + "/back/Width",
                                                                                                                                        schemaPath: "#/properties/parts/items/properties/cards/items/properties/back/properties/Width/type",
                                                                                                                                        keyword: "type",
                                                                                                                                        params: {
                                                                                                                                            type: "number"
                                                                                                                                        },
                                                                                                                                        message: "must be number"
                                                                                                                                    }];
                                                                                                                                    return false;
                                                                                                                                }
                                                                                                                                var valid6 = _errs41 === errors;
                                                                                                                            } else {
                                                                                                                                var valid6 = true;
                                                                                                                            }
                                                                                                                            if (valid6) {
                                                                                                                                if (data15.Height !== undefined) {
                                                                                                                                    let data21 = data15.Height;
                                                                                                                                    const _errs43 = errors;
                                                                                                                                    if (!((typeof data21 == "number") && (isFinite(data21)))) {
                                                                                                                                        validate21.errors = [{
                                                                                                                                            instancePath: instancePath + "/parts/" + i0 + "/cards/" + i1 + "/back/Height",
                                                                                                                                            schemaPath: "#/properties/parts/items/properties/cards/items/properties/back/properties/Height/type",
                                                                                                                                            keyword: "type",
                                                                                                                                            params: {
                                                                                                                                                type: "number"
                                                                                                                                            },
                                                                                                                                            message: "must be number"
                                                                                                                                        }];
                                                                                                                                        return false;
                                                                                                                                    }
                                                                                                                                    var valid6 = _errs43 === errors;
                                                                                                                                } else {
                                                                                                                                    var valid6 = true;
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    } else {
                                                                                                        validate21.errors = [{
                                                                                                            instancePath: instancePath + "/parts/" + i0 + "/cards/" + i1 + "/back",
                                                                                                            schemaPath: "#/properties/parts/items/properties/cards/items/properties/back/type",
                                                                                                            keyword: "type",
                                                                                                            params: {
                                                                                                                type: "object"
                                                                                                            },
                                                                                                            message: "must be object"
                                                                                                        }];
                                                                                                        return false;
                                                                                                    }
                                                                                                }
                                                                                                var valid4 = _errs31 === errors;
                                                                                            } else {
                                                                                                var valid4 = true;
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            } else {
                                                                                validate21.errors = [{
                                                                                    instancePath: instancePath + "/parts/" + i0 + "/cards/" + i1,
                                                                                    schemaPath: "#/properties/parts/items/properties/cards/items/type",
                                                                                    keyword: "type",
                                                                                    params: {
                                                                                        type: "object"
                                                                                    },
                                                                                    message: "must be object"
                                                                                }];
                                                                                return false;
                                                                            }
                                                                        }
                                                                        var valid3 = _errs13 === errors;
                                                                        if (!valid3) {
                                                                            break;
                                                                        }
                                                                    }
                                                                } else {
                                                                    validate21.errors = [{
                                                                        instancePath: instancePath + "/parts/" + i0 + "/cards",
                                                                        schemaPath: "#/properties/parts/items/properties/cards/type",
                                                                        keyword: "type",
                                                                        params: {
                                                                            type: "array"
                                                                        },
                                                                        message: "must be array"
                                                                    }];
                                                                    return false;
                                                                }
                                                            }
                                                            var valid2 = _errs11 === errors;
                                                        } else {
                                                            var valid2 = true;
                                                        }
                                                    }
                                                }
                                            } else {
                                                validate21.errors = [{
                                                    instancePath: instancePath + "/parts/" + i0,
                                                    schemaPath: "#/properties/parts/items/type",
                                                    keyword: "type",
                                                    params: {
                                                        type: "object"
                                                    },
                                                    message: "must be object"
                                                }];
                                                return false;
                                            }
                                        }
                                        var valid1 = _errs7 === errors;
                                        if (!valid1) {
                                            break;
                                        }
                                    }
                                } else {
                                    validate21.errors = [{
                                        instancePath: instancePath + "/parts",
                                        schemaPath: "#/properties/parts/type",
                                        keyword: "type",
                                        params: {
                                            type: "array"
                                        },
                                        message: "must be array"
                                    }];
                                    return false;
                                }
                            }
                            var valid0 = _errs5 === errors;
                        } else {
                            var valid0 = true;
                        }
                    }
                }
            }
        } else {
            validate21.errors = [{
                instancePath,
                schemaPath: "#/type",
                keyword: "type",
                params: {
                    type: "object"
                },
                message: "must be object"
            }];
            return false;
        }
    }
    validate21.errors = vErrors;
    return errors === 0;
}


export const projectV1Validator = validate20
export const projectV2Validator = validate21
