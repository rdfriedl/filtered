const inspectorTypes = new Map();

// nodes
inspectorTypes.set(require('core/nodes/MathNode').default, require('./nodes/MathNode').default);

// inputs
inspectorTypes.set(require('core/inputs/NumberInput').default, require('./inputs/NumberInput').default);

// outputs
inspectorTypes.set(require('core/outputs/NumberOutput').default, require('./outputs/NumberOutput').default);
inspectorTypes.set(require('core/outputs/EffectOutput').default, require('./outputs/EffectOutput').default);

export {inspectorTypes as default};
