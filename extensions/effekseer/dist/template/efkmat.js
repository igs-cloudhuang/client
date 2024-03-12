"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EFK_MATERIAL = exports.EFK_EFFECT = void 0;
const names = [
    "user",
    "user_refraction",
    "model",
    "model_refraction",
];
const to_techniques = function (idx, uniform) {
    const name = names[idx];
    let technique = `
  - name: ${name}
    passes:
    - vert: ${name}_vs:vert
      frag: ${name}_fs:frag
      properties: &props`;
    uniform.forEach(uniform => {
        technique += `
        ${uniform}: { editor: { visible: false } }`;
    });
    return technique;
};
const EFK_EFFECT = function (shaders) {
    let count = shaders.length;
    let techniques = `
CCEffect %{
  techniques:
`;
    let programs = "";
    for (let i in shaders) {
        let shader = shaders[i];
        techniques += to_techniques(parseInt(i), shader.uniforms);
        programs += `
CCProgram ${names[i]}_vs %{
  precision highp float;
  ${shader.vs}
}%

CCProgram ${names[i]}_fs %{
  precision highp float;
  ${shader.fs}
}%
`;
    }
    techniques += `
}%
`;
    return `${techniques}\n ${programs}`;
};
exports.EFK_EFFECT = EFK_EFFECT;
const EFK_MATERIAL = function (uuid) {
    return `{
  "__type__": "cc.Material",
  "_name": "",
  "_objFlags": 0,
  "_native": "",
  "_effectAsset": {
    "__uuid__": "${uuid}",
    "__expectedType__": "cc.EffectAsset"
  },
  "_techIdx": 0,
  "_defines": [
    {}
  ],
  "_states": [
    {
      "rasterizerState": {},
      "depthStencilState": {},
      "blendState": {
        "targets": [
          {}
        ]
      }
    }
  ],
  "_props": [
    {}
  ]
}
`;
};
exports.EFK_MATERIAL = EFK_MATERIAL;
