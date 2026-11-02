
import { createChunkReader, isChunky } from './sgb-reader.js';

export const MotionType = {
  NON_LOOPING: 0,
  LOOPING: 1,
  HOLD_END: 2,
};

export const MotionSegmentCompareType = {
  EQUAL: 0,
  NOT_EQUAL: 1,
  LESS: 2,
  LESS_OR_EQUAL: 3,
  GREATER: 4,
  GREATER_OR_EQUAL: 5,
};

export const MotionSegmentType = {
  FLOAT: 0,
  BOOLEAN: 1,
  STRING: 2,
};

export const MotionModifierType = {
  ABSOLUTE_TIME: 0,
  SPEED_SCALE: 1,
};

export const SelectedUiDisplayType = {
  CIRCLE: 0,
  RECTANGLE: 1,
};

export function createWheParser(mod = null, scene = null) {
  const rootScene = scene || null;
  const usedFiles = [];

  function ensure(condition, message, args = []) {
    if (condition) return;
    if (typeof console !== 'undefined') console.warn(message, ...args);
  }

  function parse(data) {
    const reader = createChunkReader(data);
    if (!isChunky(data)) {
      throw new Error('Whe: not a chunky file');
    }
    reader.skipChunky();
    const result = {};

    let current = reader.readHeader();
    if (current && current.typeid === 'DATAFBIF') {
      result.toolName = reader.readString();
      result.username = reader.readString();
      result.date = reader.readString();
      current = reader.readHeader();
    }
    if (!current || current.typeid !== 'FOLDREBP') return result;

    let header = reader.readHeader();
    while (header) {
      switch (header.typeid) {
        case 'FOLDEvTMT':
          result.motionSets = parseList(reader, header, readMotionSet);
          break;
        case 'FOLDCLMT':
          result.clauseSets = parseList(reader, header, readClauseSet);
          break;
        case 'FOLDACTS':
          result.actions = parseList(reader, header, readAction);
          break;
        case 'FOLDQRYS':
          result.queries = parseList(reader, header, readQuery);
          break;
        case 'FOLDSLCT':
          result.selected = parseList(reader, header, readSelected);
          break;
        case 'DATAACTS':
          result.eventData = readActionsData(reader, header);
          break;
        default:
          reader.skip(header.size);
          break;
      }
      header = reader.readHeader();
    }
    return result;
  }

  return { parse };
}

  function readMotion(reader) {
    const numAnimations = reader.readU32();
    const animations = [];
    for (let i = 0; i < numAnimations; i++) animations.push(reader.readString());
    const numRandom = reader.readU32();
    const randomlyPicked = [];
    for (let i = 0; i < numRandom; i++) {
      randomlyPicked.push({ name: reader.readString(), weight: reader.readFloat() });
    }
    const randomizeEachLoop = !!reader.readU8();
    const numEvents = reader.readU32();
    const motionEvents = [];
    for (let i = 0; i < numEvents; i++) {
      motionEvents.push({ name: reader.readString(), timeOffset: reader.readFloat() });
    }
    const type = reader.readU32();
    const startDelay = { min: reader.readFloat(), max: reader.readFloat() };
    const loopDelay = { min: reader.readFloat(), max: reader.readFloat() };
    reader.skip(16);
    const speed = { min: reader.readFloat(), max: reader.readFloat() };
    reader.skip(16);
    const exitDelay = { min: reader.readFloat(), max: reader.readFloat() };
    const holdEnd = !!reader.readU8();
    const ignoreTransitions = !!reader.readU8();
    const numModifiers = reader.readU32();
    const modifiers = [];
    for (let i = 0; i < numModifiers; i++) {
      modifiers.push({
        name: reader.readString(),
        type: reader.readU32(),
        amount: reader.readFloat(),
      });
    }
    return { animations, randomlyPicked, randomizeEachLoop, motionEvents, type, startDelay, loopDelay, speed, exitDelay, holdEnd, ignoreTransitions, modifiers };
  }

  function readEvent(reader) {
    const numProperties = reader.readU32();
    const properties = [];
    for (let i = 0; i < numProperties; i++) {
      properties.push({ name: reader.readString(), value: reader.readString() });
    }
    return { properties };
  }

  function readAction(reader) {
    const name = reader.readString();
    const numMotions = reader.readU32();
    const motions = [];
    for (let i = 0; i < numMotions; i++) {
      const motion = { name: reader.readString(), comparison: readComparison(reader) };
      if (motion.comparison.comparisonType !== 'NONE') {
        motion.conditionName = reader.readString();
      }
      motions.push(motion);
    }
    const numBranches = reader.readU32();
    const branches = [];
    for (let i = 0; i < numBranches; i++) {
      const branch = { name: reader.readString(), comparison: readComparison(reader) };
      if (branch.comparison.comparisonType === 'ELSE') {
        delete branch.comparison;
      }
      branches.push(branch);
    }
    return { name, motions, branches };
  }

  function readComparison(reader) {
    const comparisonType = reader.readU32();
    const comparison = Object.keys(ClauseComparisonType).find(
      (k) => ClauseComparisonType[k] === comparisonType
    ) || 'UNKNOWN';
    if (comparisonType === 0 || comparisonType === 1) {
      const conditionName = reader.readString();
      return { comparisonType: comparison, conditionName };
    }
    return { comparisonType: comparison };
  }

  function readQuery(reader) {
    const name = reader.readString();
    const numParams = reader.readU32();
    const params = [];
    for (let i = 0; i < numParams; i++) {
      params.push({ name: reader.readString(), value: reader.readString() });
    }
    return { name, params };
  }

  function readSelected(reader) {
    const name = reader.readString();
    const uiDisplayType = reader.readU32();
    const scale = { x: reader.readFloat(), z: reader.readFloat() };
    const offset = { x: reader.readFloat(), z: reader.readFloat() };
    const volume = { x: reader.readFloat(), y: reader.readFloat(), z: reader.readFloat() };
    const volumeScale = { x: reader.readFloat(), y: reader.readFloat(), z: reader.readFloat() };
    const numMats = reader.readU32();
    const mats = [];
    for (let i = 0; i < numMats; i++) mats.push(reader.readString());
    const numTriggers = reader.readU32();
    const triggers = [];
    for (let i = 0; i < numTriggers; i++) {
      triggers.push({
        name: reader.readString(),
        comparison: readComparisonTrigger(reader),
      });
    }
    return { name, uiDisplayType, scale, offset, volume, volumeScale, mats, triggers };
  }

  function readComparisonTrigger(reader) {
    const type = reader.readU32();
    if (type === 0) return { comparisonType: 'IF', condition: reader.readString() };
    if (type === 1) return { comparisonType: 'ELSE_IF', condition: reader.readString() };
    if (type === 2) return { comparisonType: 'ELSE' };
    return { comparisonType: 'NONE' };
  }

  function parseList(reader, parseFn) {
    const list = [];
    while (reader.hasData()) {
      const header = reader.readHeader();
      if (!header) break;
      if (header.typeid === 'DATAEVNT') {
        list.push(readEvent(reader));
      } else if (header.typeid === 'DATAMOTN') {
        list.push(readMotion(reader));
      } else if (header.typeid === 'DATAACTN') {
        list.push(readAction(reader));
      } else {
        reader.skip(header.size);
      }
    }
    return list;
  }
