"use strict";
const schema22 = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Generated schema for Root",
  "oneOf": [{
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
  }, {
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
  }]
};

function validate20(data, {
  instancePath = "",
  parentData,
  parentDataProperty,
  rootData = data
} = {}) {
  let vErrors = null;
  let errors = 0;
  const _errs0 = errors;
  let valid0 = false;
  let passing0 = null;
  const _errs1 = errors;
  if (errors === _errs1) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if ((((data.version === undefined) && (missing0 = "version")) || ((data.code === undefined) && (missing0 = "code"))) || ((data.cards === undefined) && (missing0 = "cards"))) {
        const err0 = {
          instancePath,
          schemaPath: "#/oneOf/0/required",
          keyword: "required",
          params: {
            missingProperty: missing0
          },
          message: "must have required property '" + missing0 + "'"
        };
        if (vErrors === null) {
          vErrors = [err0];
        } else {
          vErrors.push(err0);
        }
        errors++;
      } else {
        if (data.version !== undefined) {
          let data0 = data.version;
          const _errs3 = errors;
          if (!((typeof data0 == "number") && (isFinite(data0)))) {
            const err1 = {
              instancePath: instancePath + "/version",
              schemaPath: "#/oneOf/0/properties/version/type",
              keyword: "type",
              params: {
                type: "number"
              },
              message: "must be number"
            };
            if (vErrors === null) {
              vErrors = [err1];
            } else {
              vErrors.push(err1);
            }
            errors++;
          }
          var valid1 = _errs3 === errors;
        } else {
          var valid1 = true;
        }
        if (valid1) {
          if (data.code !== undefined) {
            const _errs5 = errors;
            if (typeof data.code !== "string") {
              const err2 = {
                instancePath: instancePath + "/code",
                schemaPath: "#/oneOf/0/properties/code/type",
                keyword: "type",
                params: {
                  type: "string"
                },
                message: "must be string"
              };
              if (vErrors === null) {
                vErrors = [err2];
              } else {
                vErrors.push(err2);
              }
              errors++;
            }
            var valid1 = _errs5 === errors;
          } else {
            var valid1 = true;
          }
          if (valid1) {
            if (data.cards !== undefined) {
              let data2 = data.cards;
              const _errs7 = errors;
              if (errors === _errs7) {
                if (Array.isArray(data2)) {
                  var valid2 = true;
                  const len0 = data2.length;
                  for (let i0 = 0; i0 < len0; i0++) {
                    let data3 = data2[i0];
                    const _errs9 = errors;
                    if (errors === _errs9) {
                      if (data3 && typeof data3 == "object" && !Array.isArray(data3)) {
                        let missing1;
                        if ((data3.count === undefined) && (missing1 = "count")) {
                          const err3 = {
                            instancePath: instancePath + "/cards/" + i0,
                            schemaPath: "#/oneOf/0/properties/cards/items/required",
                            keyword: "required",
                            params: {
                              missingProperty: missing1
                            },
                            message: "must have required property '" + missing1 + "'"
                          };
                          if (vErrors === null) {
                            vErrors = [err3];
                          } else {
                            vErrors.push(err3);
                          }
                          errors++;
                        } else {
                          if (data3.count !== undefined) {
                            let data4 = data3.count;
                            const _errs11 = errors;
                            if (!((typeof data4 == "number") && (isFinite(data4)))) {
                              const err4 = {
                                instancePath: instancePath + "/cards/" + i0 + "/count",
                                schemaPath: "#/oneOf/0/properties/cards/items/properties/count/type",
                                keyword: "type",
                                params: {
                                  type: "number"
                                },
                                message: "must be number"
                              };
                              if (vErrors === null) {
                                vErrors = [err4];
                              } else {
                                vErrors.push(err4);
                              }
                              errors++;
                            }
                            var valid3 = _errs11 === errors;
                          } else {
                            var valid3 = true;
                          }
                          if (valid3) {
                            if (data3.front !== undefined) {
                              let data5 = data3.front;
                              const _errs13 = errors;
                              if (errors === _errs13) {
                                if (data5 && typeof data5 == "object" && !Array.isArray(data5)) {
                                  let missing2;
                                  if (((((((data5.Name === undefined) && (missing2 = "Name")) || ((data5.ID === undefined) && (missing2 = "ID"))) || ((data5.SourceID === undefined) && (missing2 = "SourceID"))) || ((data5.Exp === undefined) && (missing2 = "Exp"))) || ((data5.Width === undefined) && (missing2 = "Width"))) || ((data5.Height === undefined) && (missing2 = "Height"))) {
                                    const err5 = {
                                      instancePath: instancePath + "/cards/" + i0 + "/front",
                                      schemaPath: "#/oneOf/0/properties/cards/items/properties/front/required",
                                      keyword: "required",
                                      params: {
                                        missingProperty: missing2
                                      },
                                      message: "must have required property '" + missing2 + "'"
                                    };
                                    if (vErrors === null) {
                                      vErrors = [err5];
                                    } else {
                                      vErrors.push(err5);
                                    }
                                    errors++;
                                  } else {
                                    if (data5.Name !== undefined) {
                                      const _errs15 = errors;
                                      if (typeof data5.Name !== "string") {
                                        const err6 = {
                                          instancePath: instancePath + "/cards/" + i0 + "/front/Name",
                                          schemaPath: "#/oneOf/0/properties/cards/items/properties/front/properties/Name/type",
                                          keyword: "type",
                                          params: {
                                            type: "string"
                                          },
                                          message: "must be string"
                                        };
                                        if (vErrors === null) {
                                          vErrors = [err6];
                                        } else {
                                          vErrors.push(err6);
                                        }
                                        errors++;
                                      }
                                      var valid4 = _errs15 === errors;
                                    } else {
                                      var valid4 = true;
                                    }
                                    if (valid4) {
                                      if (data5.ID !== undefined) {
                                        const _errs17 = errors;
                                        if (typeof data5.ID !== "string") {
                                          const err7 = {
                                            instancePath: instancePath + "/cards/" + i0 + "/front/ID",
                                            schemaPath: "#/oneOf/0/properties/cards/items/properties/front/properties/ID/type",
                                            keyword: "type",
                                            params: {
                                              type: "string"
                                            },
                                            message: "must be string"
                                          };
                                          if (vErrors === null) {
                                            vErrors = [err7];
                                          } else {
                                            vErrors.push(err7);
                                          }
                                          errors++;
                                        }
                                        var valid4 = _errs17 === errors;
                                      } else {
                                        var valid4 = true;
                                      }
                                      if (valid4) {
                                        if (data5.SourceID !== undefined) {
                                          const _errs19 = errors;
                                          if (typeof data5.SourceID !== "string") {
                                            const err8 = {
                                              instancePath: instancePath + "/cards/" + i0 + "/front/SourceID",
                                              schemaPath: "#/oneOf/0/properties/cards/items/properties/front/properties/SourceID/type",
                                              keyword: "type",
                                              params: {
                                                type: "string"
                                              },
                                              message: "must be string"
                                            };
                                            if (vErrors === null) {
                                              vErrors = [err8];
                                            } else {
                                              vErrors.push(err8);
                                            }
                                            errors++;
                                          }
                                          var valid4 = _errs19 === errors;
                                        } else {
                                          var valid4 = true;
                                        }
                                        if (valid4) {
                                          if (data5.Exp !== undefined) {
                                            const _errs21 = errors;
                                            if (typeof data5.Exp !== "string") {
                                              const err9 = {
                                                instancePath: instancePath + "/cards/" + i0 + "/front/Exp",
                                                schemaPath: "#/oneOf/0/properties/cards/items/properties/front/properties/Exp/type",
                                                keyword: "type",
                                                params: {
                                                  type: "string"
                                                },
                                                message: "must be string"
                                              };
                                              if (vErrors === null) {
                                                vErrors = [err9];
                                              } else {
                                                vErrors.push(err9);
                                              }
                                              errors++;
                                            }
                                            var valid4 = _errs21 === errors;
                                          } else {
                                            var valid4 = true;
                                          }
                                          if (valid4) {
                                            if (data5.Width !== undefined) {
                                              let data10 = data5.Width;
                                              const _errs23 = errors;
                                              if (!((typeof data10 == "number") && (isFinite(data10)))) {
                                                const err10 = {
                                                  instancePath: instancePath + "/cards/" + i0 + "/front/Width",
                                                  schemaPath: "#/oneOf/0/properties/cards/items/properties/front/properties/Width/type",
                                                  keyword: "type",
                                                  params: {
                                                    type: "number"
                                                  },
                                                  message: "must be number"
                                                };
                                                if (vErrors === null) {
                                                  vErrors = [err10];
                                                } else {
                                                  vErrors.push(err10);
                                                }
                                                errors++;
                                              }
                                              var valid4 = _errs23 === errors;
                                            } else {
                                              var valid4 = true;
                                            }
                                            if (valid4) {
                                              if (data5.Height !== undefined) {
                                                let data11 = data5.Height;
                                                const _errs25 = errors;
                                                if (!((typeof data11 == "number") && (isFinite(data11)))) {
                                                  const err11 = {
                                                    instancePath: instancePath + "/cards/" + i0 + "/front/Height",
                                                    schemaPath: "#/oneOf/0/properties/cards/items/properties/front/properties/Height/type",
                                                    keyword: "type",
                                                    params: {
                                                      type: "number"
                                                    },
                                                    message: "must be number"
                                                  };
                                                  if (vErrors === null) {
                                                    vErrors = [err11];
                                                  } else {
                                                    vErrors.push(err11);
                                                  }
                                                  errors++;
                                                }
                                                var valid4 = _errs25 === errors;
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
                                  const err12 = {
                                    instancePath: instancePath + "/cards/" + i0 + "/front",
                                    schemaPath: "#/oneOf/0/properties/cards/items/properties/front/type",
                                    keyword: "type",
                                    params: {
                                      type: "object"
                                    },
                                    message: "must be object"
                                  };
                                  if (vErrors === null) {
                                    vErrors = [err12];
                                  } else {
                                    vErrors.push(err12);
                                  }
                                  errors++;
                                }
                              }
                              var valid3 = _errs13 === errors;
                            } else {
                              var valid3 = true;
                            }
                            if (valid3) {
                              if (data3.back !== undefined) {
                                let data12 = data3.back;
                                const _errs27 = errors;
                                if (errors === _errs27) {
                                  if (data12 && typeof data12 == "object" && !Array.isArray(data12)) {
                                    let missing3;
                                    if (((((((data12.Name === undefined) && (missing3 = "Name")) || ((data12.ID === undefined) && (missing3 = "ID"))) || ((data12.SourceID === undefined) && (missing3 = "SourceID"))) || ((data12.Exp === undefined) && (missing3 = "Exp"))) || ((data12.Width === undefined) && (missing3 = "Width"))) || ((data12.Height === undefined) && (missing3 = "Height"))) {
                                      const err13 = {
                                        instancePath: instancePath + "/cards/" + i0 + "/back",
                                        schemaPath: "#/oneOf/0/properties/cards/items/properties/back/required",
                                        keyword: "required",
                                        params: {
                                          missingProperty: missing3
                                        },
                                        message: "must have required property '" + missing3 + "'"
                                      };
                                      if (vErrors === null) {
                                        vErrors = [err13];
                                      } else {
                                        vErrors.push(err13);
                                      }
                                      errors++;
                                    } else {
                                      if (data12.Name !== undefined) {
                                        const _errs29 = errors;
                                        if (typeof data12.Name !== "string") {
                                          const err14 = {
                                            instancePath: instancePath + "/cards/" + i0 + "/back/Name",
                                            schemaPath: "#/oneOf/0/properties/cards/items/properties/back/properties/Name/type",
                                            keyword: "type",
                                            params: {
                                              type: "string"
                                            },
                                            message: "must be string"
                                          };
                                          if (vErrors === null) {
                                            vErrors = [err14];
                                          } else {
                                            vErrors.push(err14);
                                          }
                                          errors++;
                                        }
                                        var valid5 = _errs29 === errors;
                                      } else {
                                        var valid5 = true;
                                      }
                                      if (valid5) {
                                        if (data12.ID !== undefined) {
                                          const _errs31 = errors;
                                          if (typeof data12.ID !== "string") {
                                            const err15 = {
                                              instancePath: instancePath + "/cards/" + i0 + "/back/ID",
                                              schemaPath: "#/oneOf/0/properties/cards/items/properties/back/properties/ID/type",
                                              keyword: "type",
                                              params: {
                                                type: "string"
                                              },
                                              message: "must be string"
                                            };
                                            if (vErrors === null) {
                                              vErrors = [err15];
                                            } else {
                                              vErrors.push(err15);
                                            }
                                            errors++;
                                          }
                                          var valid5 = _errs31 === errors;
                                        } else {
                                          var valid5 = true;
                                        }
                                        if (valid5) {
                                          if (data12.SourceID !== undefined) {
                                            const _errs33 = errors;
                                            if (typeof data12.SourceID !== "string") {
                                              const err16 = {
                                                instancePath: instancePath + "/cards/" + i0 + "/back/SourceID",
                                                schemaPath: "#/oneOf/0/properties/cards/items/properties/back/properties/SourceID/type",
                                                keyword: "type",
                                                params: {
                                                  type: "string"
                                                },
                                                message: "must be string"
                                              };
                                              if (vErrors === null) {
                                                vErrors = [err16];
                                              } else {
                                                vErrors.push(err16);
                                              }
                                              errors++;
                                            }
                                            var valid5 = _errs33 === errors;
                                          } else {
                                            var valid5 = true;
                                          }
                                          if (valid5) {
                                            if (data12.Exp !== undefined) {
                                              const _errs35 = errors;
                                              if (typeof data12.Exp !== "string") {
                                                const err17 = {
                                                  instancePath: instancePath + "/cards/" + i0 + "/back/Exp",
                                                  schemaPath: "#/oneOf/0/properties/cards/items/properties/back/properties/Exp/type",
                                                  keyword: "type",
                                                  params: {
                                                    type: "string"
                                                  },
                                                  message: "must be string"
                                                };
                                                if (vErrors === null) {
                                                  vErrors = [err17];
                                                } else {
                                                  vErrors.push(err17);
                                                }
                                                errors++;
                                              }
                                              var valid5 = _errs35 === errors;
                                            } else {
                                              var valid5 = true;
                                            }
                                            if (valid5) {
                                              if (data12.Width !== undefined) {
                                                let data17 = data12.Width;
                                                const _errs37 = errors;
                                                if (!((typeof data17 == "number") && (isFinite(data17)))) {
                                                  const err18 = {
                                                    instancePath: instancePath + "/cards/" + i0 + "/back/Width",
                                                    schemaPath: "#/oneOf/0/properties/cards/items/properties/back/properties/Width/type",
                                                    keyword: "type",
                                                    params: {
                                                      type: "number"
                                                    },
                                                    message: "must be number"
                                                  };
                                                  if (vErrors === null) {
                                                    vErrors = [err18];
                                                  } else {
                                                    vErrors.push(err18);
                                                  }
                                                  errors++;
                                                }
                                                var valid5 = _errs37 === errors;
                                              } else {
                                                var valid5 = true;
                                              }
                                              if (valid5) {
                                                if (data12.Height !== undefined) {
                                                  let data18 = data12.Height;
                                                  const _errs39 = errors;
                                                  if (!((typeof data18 == "number") && (isFinite(data18)))) {
                                                    const err19 = {
                                                      instancePath: instancePath + "/cards/" + i0 + "/back/Height",
                                                      schemaPath: "#/oneOf/0/properties/cards/items/properties/back/properties/Height/type",
                                                      keyword: "type",
                                                      params: {
                                                        type: "number"
                                                      },
                                                      message: "must be number"
                                                    };
                                                    if (vErrors === null) {
                                                      vErrors = [err19];
                                                    } else {
                                                      vErrors.push(err19);
                                                    }
                                                    errors++;
                                                  }
                                                  var valid5 = _errs39 === errors;
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
                                    const err20 = {
                                      instancePath: instancePath + "/cards/" + i0 + "/back",
                                      schemaPath: "#/oneOf/0/properties/cards/items/properties/back/type",
                                      keyword: "type",
                                      params: {
                                        type: "object"
                                      },
                                      message: "must be object"
                                    };
                                    if (vErrors === null) {
                                      vErrors = [err20];
                                    } else {
                                      vErrors.push(err20);
                                    }
                                    errors++;
                                  }
                                }
                                var valid3 = _errs27 === errors;
                              } else {
                                var valid3 = true;
                              }
                            }
                          }
                        }
                      } else {
                        const err21 = {
                          instancePath: instancePath + "/cards/" + i0,
                          schemaPath: "#/oneOf/0/properties/cards/items/type",
                          keyword: "type",
                          params: {
                            type: "object"
                          },
                          message: "must be object"
                        };
                        if (vErrors === null) {
                          vErrors = [err21];
                        } else {
                          vErrors.push(err21);
                        }
                        errors++;
                      }
                    }
                    var valid2 = _errs9 === errors;
                    if (!valid2) {
                      break;
                    }
                  }
                } else {
                  const err22 = {
                    instancePath: instancePath + "/cards",
                    schemaPath: "#/oneOf/0/properties/cards/type",
                    keyword: "type",
                    params: {
                      type: "array"
                    },
                    message: "must be array"
                  };
                  if (vErrors === null) {
                    vErrors = [err22];
                  } else {
                    vErrors.push(err22);
                  }
                  errors++;
                }
              }
              var valid1 = _errs7 === errors;
            } else {
              var valid1 = true;
            }
          }
        }
      }
    } else {
      const err23 = {
        instancePath,
        schemaPath: "#/oneOf/0/type",
        keyword: "type",
        params: {
          type: "object"
        },
        message: "must be object"
      };
      if (vErrors === null) {
        vErrors = [err23];
      } else {
        vErrors.push(err23);
      }
      errors++;
    }
  }
  var _valid0 = _errs1 === errors;
  if (_valid0) {
    valid0 = true;
    passing0 = 0;
  }
  const _errs41 = errors;
  if (errors === _errs41) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing4;
      if ((((data.version === undefined) && (missing4 = "version")) || ((data.code === undefined) && (missing4 = "code"))) || ((data.parts === undefined) && (missing4 = "parts"))) {
        const err24 = {
          instancePath,
          schemaPath: "#/oneOf/1/required",
          keyword: "required",
          params: {
            missingProperty: missing4
          },
          message: "must have required property '" + missing4 + "'"
        };
        if (vErrors === null) {
          vErrors = [err24];
        } else {
          vErrors.push(err24);
        }
        errors++;
      } else {
        if (data.version !== undefined) {
          let data19 = data.version;
          const _errs43 = errors;
          if (!((typeof data19 == "number") && (isFinite(data19)))) {
            const err25 = {
              instancePath: instancePath + "/version",
              schemaPath: "#/oneOf/1/properties/version/type",
              keyword: "type",
              params: {
                type: "number"
              },
              message: "must be number"
            };
            if (vErrors === null) {
              vErrors = [err25];
            } else {
              vErrors.push(err25);
            }
            errors++;
          }
          var valid6 = _errs43 === errors;
        } else {
          var valid6 = true;
        }
        if (valid6) {
          if (data.code !== undefined) {
            const _errs45 = errors;
            if (typeof data.code !== "string") {
              const err26 = {
                instancePath: instancePath + "/code",
                schemaPath: "#/oneOf/1/properties/code/type",
                keyword: "type",
                params: {
                  type: "string"
                },
                message: "must be string"
              };
              if (vErrors === null) {
                vErrors = [err26];
              } else {
                vErrors.push(err26);
              }
              errors++;
            }
            var valid6 = _errs45 === errors;
          } else {
            var valid6 = true;
          }
          if (valid6) {
            if (data.parts !== undefined) {
              let data21 = data.parts;
              const _errs47 = errors;
              if (errors === _errs47) {
                if (Array.isArray(data21)) {
                  var valid7 = true;
                  const len1 = data21.length;
                  for (let i1 = 0; i1 < len1; i1++) {
                    let data22 = data21[i1];
                    const _errs49 = errors;
                    if (errors === _errs49) {
                      if (data22 && typeof data22 == "object" && !Array.isArray(data22)) {
                        let missing5;
                        if (((data22.name === undefined) && (missing5 = "name")) || ((data22.cards === undefined) && (missing5 = "cards"))) {
                          const err27 = {
                            instancePath: instancePath + "/parts/" + i1,
                            schemaPath: "#/oneOf/1/properties/parts/items/required",
                            keyword: "required",
                            params: {
                              missingProperty: missing5
                            },
                            message: "must have required property '" + missing5 + "'"
                          };
                          if (vErrors === null) {
                            vErrors = [err27];
                          } else {
                            vErrors.push(err27);
                          }
                          errors++;
                        } else {
                          if (data22.name !== undefined) {
                            const _errs51 = errors;
                            if (typeof data22.name !== "string") {
                              const err28 = {
                                instancePath: instancePath + "/parts/" + i1 + "/name",
                                schemaPath: "#/oneOf/1/properties/parts/items/properties/name/type",
                                keyword: "type",
                                params: {
                                  type: "string"
                                },
                                message: "must be string"
                              };
                              if (vErrors === null) {
                                vErrors = [err28];
                              } else {
                                vErrors.push(err28);
                              }
                              errors++;
                            }
                            var valid8 = _errs51 === errors;
                          } else {
                            var valid8 = true;
                          }
                          if (valid8) {
                            if (data22.cards !== undefined) {
                              let data24 = data22.cards;
                              const _errs53 = errors;
                              if (errors === _errs53) {
                                if (Array.isArray(data24)) {
                                  var valid9 = true;
                                  const len2 = data24.length;
                                  for (let i2 = 0; i2 < len2; i2++) {
                                    let data25 = data24[i2];
                                    const _errs55 = errors;
                                    if (errors === _errs55) {
                                      if (data25 && typeof data25 == "object" && !Array.isArray(data25)) {
                                        let missing6;
                                        if ((data25.count === undefined) && (missing6 = "count")) {
                                          const err29 = {
                                            instancePath: instancePath + "/parts/" + i1 + "/cards/" + i2,
                                            schemaPath: "#/oneOf/1/properties/parts/items/properties/cards/items/required",
                                            keyword: "required",
                                            params: {
                                              missingProperty: missing6
                                            },
                                            message: "must have required property '" + missing6 + "'"
                                          };
                                          if (vErrors === null) {
                                            vErrors = [err29];
                                          } else {
                                            vErrors.push(err29);
                                          }
                                          errors++;
                                        } else {
                                          if (data25.count !== undefined) {
                                            let data26 = data25.count;
                                            const _errs57 = errors;
                                            if (!((typeof data26 == "number") && (isFinite(data26)))) {
                                              const err30 = {
                                                instancePath: instancePath + "/parts/" + i1 + "/cards/" + i2 + "/count",
                                                schemaPath: "#/oneOf/1/properties/parts/items/properties/cards/items/properties/count/type",
                                                keyword: "type",
                                                params: {
                                                  type: "number"
                                                },
                                                message: "must be number"
                                              };
                                              if (vErrors === null) {
                                                vErrors = [err30];
                                              } else {
                                                vErrors.push(err30);
                                              }
                                              errors++;
                                            }
                                            var valid10 = _errs57 === errors;
                                          } else {
                                            var valid10 = true;
                                          }
                                          if (valid10) {
                                            if (data25.front !== undefined) {
                                              let data27 = data25.front;
                                              const _errs59 = errors;
                                              if (errors === _errs59) {
                                                if (data27 && typeof data27 == "object" && !Array.isArray(data27)) {
                                                  let missing7;
                                                  if (((((((data27.Name === undefined) && (missing7 = "Name")) || ((data27.ID === undefined) && (missing7 = "ID"))) || ((data27.SourceID === undefined) && (missing7 = "SourceID"))) || ((data27.Exp === undefined) && (missing7 = "Exp"))) || ((data27.Width === undefined) && (missing7 = "Width"))) || ((data27.Height === undefined) && (missing7 = "Height"))) {
                                                    const err31 = {
                                                      instancePath: instancePath + "/parts/" + i1 + "/cards/" + i2 + "/front",
                                                      schemaPath: "#/oneOf/1/properties/parts/items/properties/cards/items/properties/front/required",
                                                      keyword: "required",
                                                      params: {
                                                        missingProperty: missing7
                                                      },
                                                      message: "must have required property '" + missing7 + "'"
                                                    };
                                                    if (vErrors === null) {
                                                      vErrors = [err31];
                                                    } else {
                                                      vErrors.push(err31);
                                                    }
                                                    errors++;
                                                  } else {
                                                    if (data27.Name !== undefined) {
                                                      const _errs61 = errors;
                                                      if (typeof data27.Name !== "string") {
                                                        const err32 = {
                                                          instancePath: instancePath + "/parts/" + i1 + "/cards/" + i2 + "/front/Name",
                                                          schemaPath: "#/oneOf/1/properties/parts/items/properties/cards/items/properties/front/properties/Name/type",
                                                          keyword: "type",
                                                          params: {
                                                            type: "string"
                                                          },
                                                          message: "must be string"
                                                        };
                                                        if (vErrors === null) {
                                                          vErrors = [err32];
                                                        } else {
                                                          vErrors.push(err32);
                                                        }
                                                        errors++;
                                                      }
                                                      var valid11 = _errs61 === errors;
                                                    } else {
                                                      var valid11 = true;
                                                    }
                                                    if (valid11) {
                                                      if (data27.ID !== undefined) {
                                                        const _errs63 = errors;
                                                        if (typeof data27.ID !== "string") {
                                                          const err33 = {
                                                            instancePath: instancePath + "/parts/" + i1 + "/cards/" + i2 + "/front/ID",
                                                            schemaPath: "#/oneOf/1/properties/parts/items/properties/cards/items/properties/front/properties/ID/type",
                                                            keyword: "type",
                                                            params: {
                                                              type: "string"
                                                            },
                                                            message: "must be string"
                                                          };
                                                          if (vErrors === null) {
                                                            vErrors = [err33];
                                                          } else {
                                                            vErrors.push(err33);
                                                          }
                                                          errors++;
                                                        }
                                                        var valid11 = _errs63 === errors;
                                                      } else {
                                                        var valid11 = true;
                                                      }
                                                      if (valid11) {
                                                        if (data27.SourceID !== undefined) {
                                                          const _errs65 = errors;
                                                          if (typeof data27.SourceID !== "string") {
                                                            const err34 = {
                                                              instancePath: instancePath + "/parts/" + i1 + "/cards/" + i2 + "/front/SourceID",
                                                              schemaPath: "#/oneOf/1/properties/parts/items/properties/cards/items/properties/front/properties/SourceID/type",
                                                              keyword: "type",
                                                              params: {
                                                                type: "string"
                                                              },
                                                              message: "must be string"
                                                            };
                                                            if (vErrors === null) {
                                                              vErrors = [err34];
                                                            } else {
                                                              vErrors.push(err34);
                                                            }
                                                            errors++;
                                                          }
                                                          var valid11 = _errs65 === errors;
                                                        } else {
                                                          var valid11 = true;
                                                        }
                                                        if (valid11) {
                                                          if (data27.Exp !== undefined) {
                                                            const _errs67 = errors;
                                                            if (typeof data27.Exp !== "string") {
                                                              const err35 = {
                                                                instancePath: instancePath + "/parts/" + i1 + "/cards/" + i2 + "/front/Exp",
                                                                schemaPath: "#/oneOf/1/properties/parts/items/properties/cards/items/properties/front/properties/Exp/type",
                                                                keyword: "type",
                                                                params: {
                                                                  type: "string"
                                                                },
                                                                message: "must be string"
                                                              };
                                                              if (vErrors === null) {
                                                                vErrors = [err35];
                                                              } else {
                                                                vErrors.push(err35);
                                                              }
                                                              errors++;
                                                            }
                                                            var valid11 = _errs67 === errors;
                                                          } else {
                                                            var valid11 = true;
                                                          }
                                                          if (valid11) {
                                                            if (data27.Width !== undefined) {
                                                              let data32 = data27.Width;
                                                              const _errs69 = errors;
                                                              if (!((typeof data32 == "number") && (isFinite(data32)))) {
                                                                const err36 = {
                                                                  instancePath: instancePath + "/parts/" + i1 + "/cards/" + i2 + "/front/Width",
                                                                  schemaPath: "#/oneOf/1/properties/parts/items/properties/cards/items/properties/front/properties/Width/type",
                                                                  keyword: "type",
                                                                  params: {
                                                                    type: "number"
                                                                  },
                                                                  message: "must be number"
                                                                };
                                                                if (vErrors === null) {
                                                                  vErrors = [err36];
                                                                } else {
                                                                  vErrors.push(err36);
                                                                }
                                                                errors++;
                                                              }
                                                              var valid11 = _errs69 === errors;
                                                            } else {
                                                              var valid11 = true;
                                                            }
                                                            if (valid11) {
                                                              if (data27.Height !== undefined) {
                                                                let data33 = data27.Height;
                                                                const _errs71 = errors;
                                                                if (!((typeof data33 == "number") && (isFinite(data33)))) {
                                                                  const err37 = {
                                                                    instancePath: instancePath + "/parts/" + i1 + "/cards/" + i2 + "/front/Height",
                                                                    schemaPath: "#/oneOf/1/properties/parts/items/properties/cards/items/properties/front/properties/Height/type",
                                                                    keyword: "type",
                                                                    params: {
                                                                      type: "number"
                                                                    },
                                                                    message: "must be number"
                                                                  };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err37];
                                                                  } else {
                                                                    vErrors.push(err37);
                                                                  }
                                                                  errors++;
                                                                }
                                                                var valid11 = _errs71 === errors;
                                                              } else {
                                                                var valid11 = true;
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                } else {
                                                  const err38 = {
                                                    instancePath: instancePath + "/parts/" + i1 + "/cards/" + i2 + "/front",
                                                    schemaPath: "#/oneOf/1/properties/parts/items/properties/cards/items/properties/front/type",
                                                    keyword: "type",
                                                    params: {
                                                      type: "object"
                                                    },
                                                    message: "must be object"
                                                  };
                                                  if (vErrors === null) {
                                                    vErrors = [err38];
                                                  } else {
                                                    vErrors.push(err38);
                                                  }
                                                  errors++;
                                                }
                                              }
                                              var valid10 = _errs59 === errors;
                                            } else {
                                              var valid10 = true;
                                            }
                                            if (valid10) {
                                              if (data25.back !== undefined) {
                                                let data34 = data25.back;
                                                const _errs73 = errors;
                                                if (errors === _errs73) {
                                                  if (data34 && typeof data34 == "object" && !Array.isArray(data34)) {
                                                    let missing8;
                                                    if (((((((data34.Name === undefined) && (missing8 = "Name")) || ((data34.ID === undefined) && (missing8 = "ID"))) || ((data34.SourceID === undefined) && (missing8 = "SourceID"))) || ((data34.Exp === undefined) && (missing8 = "Exp"))) || ((data34.Width === undefined) && (missing8 = "Width"))) || ((data34.Height === undefined) && (missing8 = "Height"))) {
                                                      const err39 = {
                                                        instancePath: instancePath + "/parts/" + i1 + "/cards/" + i2 + "/back",
                                                        schemaPath: "#/oneOf/1/properties/parts/items/properties/cards/items/properties/back/required",
                                                        keyword: "required",
                                                        params: {
                                                          missingProperty: missing8
                                                        },
                                                        message: "must have required property '" + missing8 + "'"
                                                      };
                                                      if (vErrors === null) {
                                                        vErrors = [err39];
                                                      } else {
                                                        vErrors.push(err39);
                                                      }
                                                      errors++;
                                                    } else {
                                                      if (data34.Name !== undefined) {
                                                        const _errs75 = errors;
                                                        if (typeof data34.Name !== "string") {
                                                          const err40 = {
                                                            instancePath: instancePath + "/parts/" + i1 + "/cards/" + i2 + "/back/Name",
                                                            schemaPath: "#/oneOf/1/properties/parts/items/properties/cards/items/properties/back/properties/Name/type",
                                                            keyword: "type",
                                                            params: {
                                                              type: "string"
                                                            },
                                                            message: "must be string"
                                                          };
                                                          if (vErrors === null) {
                                                            vErrors = [err40];
                                                          } else {
                                                            vErrors.push(err40);
                                                          }
                                                          errors++;
                                                        }
                                                        var valid12 = _errs75 === errors;
                                                      } else {
                                                        var valid12 = true;
                                                      }
                                                      if (valid12) {
                                                        if (data34.ID !== undefined) {
                                                          const _errs77 = errors;
                                                          if (typeof data34.ID !== "string") {
                                                            const err41 = {
                                                              instancePath: instancePath + "/parts/" + i1 + "/cards/" + i2 + "/back/ID",
                                                              schemaPath: "#/oneOf/1/properties/parts/items/properties/cards/items/properties/back/properties/ID/type",
                                                              keyword: "type",
                                                              params: {
                                                                type: "string"
                                                              },
                                                              message: "must be string"
                                                            };
                                                            if (vErrors === null) {
                                                              vErrors = [err41];
                                                            } else {
                                                              vErrors.push(err41);
                                                            }
                                                            errors++;
                                                          }
                                                          var valid12 = _errs77 === errors;
                                                        } else {
                                                          var valid12 = true;
                                                        }
                                                        if (valid12) {
                                                          if (data34.SourceID !== undefined) {
                                                            const _errs79 = errors;
                                                            if (typeof data34.SourceID !== "string") {
                                                              const err42 = {
                                                                instancePath: instancePath + "/parts/" + i1 + "/cards/" + i2 + "/back/SourceID",
                                                                schemaPath: "#/oneOf/1/properties/parts/items/properties/cards/items/properties/back/properties/SourceID/type",
                                                                keyword: "type",
                                                                params: {
                                                                  type: "string"
                                                                },
                                                                message: "must be string"
                                                              };
                                                              if (vErrors === null) {
                                                                vErrors = [err42];
                                                              } else {
                                                                vErrors.push(err42);
                                                              }
                                                              errors++;
                                                            }
                                                            var valid12 = _errs79 === errors;
                                                          } else {
                                                            var valid12 = true;
                                                          }
                                                          if (valid12) {
                                                            if (data34.Exp !== undefined) {
                                                              const _errs81 = errors;
                                                              if (typeof data34.Exp !== "string") {
                                                                const err43 = {
                                                                  instancePath: instancePath + "/parts/" + i1 + "/cards/" + i2 + "/back/Exp",
                                                                  schemaPath: "#/oneOf/1/properties/parts/items/properties/cards/items/properties/back/properties/Exp/type",
                                                                  keyword: "type",
                                                                  params: {
                                                                    type: "string"
                                                                  },
                                                                  message: "must be string"
                                                                };
                                                                if (vErrors === null) {
                                                                  vErrors = [err43];
                                                                } else {
                                                                  vErrors.push(err43);
                                                                }
                                                                errors++;
                                                              }
                                                              var valid12 = _errs81 === errors;
                                                            } else {
                                                              var valid12 = true;
                                                            }
                                                            if (valid12) {
                                                              if (data34.Width !== undefined) {
                                                                let data39 = data34.Width;
                                                                const _errs83 = errors;
                                                                if (!((typeof data39 == "number") && (isFinite(data39)))) {
                                                                  const err44 = {
                                                                    instancePath: instancePath + "/parts/" + i1 + "/cards/" + i2 + "/back/Width",
                                                                    schemaPath: "#/oneOf/1/properties/parts/items/properties/cards/items/properties/back/properties/Width/type",
                                                                    keyword: "type",
                                                                    params: {
                                                                      type: "number"
                                                                    },
                                                                    message: "must be number"
                                                                  };
                                                                  if (vErrors === null) {
                                                                    vErrors = [err44];
                                                                  } else {
                                                                    vErrors.push(err44);
                                                                  }
                                                                  errors++;
                                                                }
                                                                var valid12 = _errs83 === errors;
                                                              } else {
                                                                var valid12 = true;
                                                              }
                                                              if (valid12) {
                                                                if (data34.Height !== undefined) {
                                                                  let data40 = data34.Height;
                                                                  const _errs85 = errors;
                                                                  if (!((typeof data40 == "number") && (isFinite(data40)))) {
                                                                    const err45 = {
                                                                      instancePath: instancePath + "/parts/" + i1 + "/cards/" + i2 + "/back/Height",
                                                                      schemaPath: "#/oneOf/1/properties/parts/items/properties/cards/items/properties/back/properties/Height/type",
                                                                      keyword: "type",
                                                                      params: {
                                                                        type: "number"
                                                                      },
                                                                      message: "must be number"
                                                                    };
                                                                    if (vErrors === null) {
                                                                      vErrors = [err45];
                                                                    } else {
                                                                      vErrors.push(err45);
                                                                    }
                                                                    errors++;
                                                                  }
                                                                  var valid12 = _errs85 === errors;
                                                                } else {
                                                                  var valid12 = true;
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  } else {
                                                    const err46 = {
                                                      instancePath: instancePath + "/parts/" + i1 + "/cards/" + i2 + "/back",
                                                      schemaPath: "#/oneOf/1/properties/parts/items/properties/cards/items/properties/back/type",
                                                      keyword: "type",
                                                      params: {
                                                        type: "object"
                                                      },
                                                      message: "must be object"
                                                    };
                                                    if (vErrors === null) {
                                                      vErrors = [err46];
                                                    } else {
                                                      vErrors.push(err46);
                                                    }
                                                    errors++;
                                                  }
                                                }
                                                var valid10 = _errs73 === errors;
                                              } else {
                                                var valid10 = true;
                                              }
                                            }
                                          }
                                        }
                                      } else {
                                        const err47 = {
                                          instancePath: instancePath + "/parts/" + i1 + "/cards/" + i2,
                                          schemaPath: "#/oneOf/1/properties/parts/items/properties/cards/items/type",
                                          keyword: "type",
                                          params: {
                                            type: "object"
                                          },
                                          message: "must be object"
                                        };
                                        if (vErrors === null) {
                                          vErrors = [err47];
                                        } else {
                                          vErrors.push(err47);
                                        }
                                        errors++;
                                      }
                                    }
                                    var valid9 = _errs55 === errors;
                                    if (!valid9) {
                                      break;
                                    }
                                  }
                                } else {
                                  const err48 = {
                                    instancePath: instancePath + "/parts/" + i1 + "/cards",
                                    schemaPath: "#/oneOf/1/properties/parts/items/properties/cards/type",
                                    keyword: "type",
                                    params: {
                                      type: "array"
                                    },
                                    message: "must be array"
                                  };
                                  if (vErrors === null) {
                                    vErrors = [err48];
                                  } else {
                                    vErrors.push(err48);
                                  }
                                  errors++;
                                }
                              }
                              var valid8 = _errs53 === errors;
                            } else {
                              var valid8 = true;
                            }
                          }
                        }
                      } else {
                        const err49 = {
                          instancePath: instancePath + "/parts/" + i1,
                          schemaPath: "#/oneOf/1/properties/parts/items/type",
                          keyword: "type",
                          params: {
                            type: "object"
                          },
                          message: "must be object"
                        };
                        if (vErrors === null) {
                          vErrors = [err49];
                        } else {
                          vErrors.push(err49);
                        }
                        errors++;
                      }
                    }
                    var valid7 = _errs49 === errors;
                    if (!valid7) {
                      break;
                    }
                  }
                } else {
                  const err50 = {
                    instancePath: instancePath + "/parts",
                    schemaPath: "#/oneOf/1/properties/parts/type",
                    keyword: "type",
                    params: {
                      type: "array"
                    },
                    message: "must be array"
                  };
                  if (vErrors === null) {
                    vErrors = [err50];
                  } else {
                    vErrors.push(err50);
                  }
                  errors++;
                }
              }
              var valid6 = _errs47 === errors;
            } else {
              var valid6 = true;
            }
          }
        }
      }
    } else {
      const err51 = {
        instancePath,
        schemaPath: "#/oneOf/1/type",
        keyword: "type",
        params: {
          type: "object"
        },
        message: "must be object"
      };
      if (vErrors === null) {
        vErrors = [err51];
      } else {
        vErrors.push(err51);
      }
      errors++;
    }
  }
  var _valid0 = _errs41 === errors;
  if (_valid0 && valid0) {
    valid0 = false;
    passing0 = [passing0, 1];
  } else {
    if (_valid0) {
      valid0 = true;
      passing0 = 1;
    }
  }
  if (!valid0) {
    const err52 = {
      instancePath,
      schemaPath: "#/oneOf",
      keyword: "oneOf",
      params: {
        passingSchemas: passing0
      },
      message: "must match exactly one schema in oneOf"
    };
    if (vErrors === null) {
      vErrors = [err52];
    } else {
      vErrors.push(err52);
    }
    errors++;
    validate20.errors = vErrors;
    return false;
  } else {
    errors = _errs0;
    if (vErrors !== null) {
      if (_errs0) {
        vErrors.length = _errs0;
      } else {
        vErrors = null;
      }
    }
  }
  validate20.errors = vErrors;
  return errors === 0;
}

export const projectValidator = validate20
